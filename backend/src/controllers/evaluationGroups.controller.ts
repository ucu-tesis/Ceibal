import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AnalysisStatus, EvaluationGroup } from '@prisma/client';
import { IsDateString, IsNumber } from 'class-validator';
import * as dayjs from 'dayjs';
import { Pagination } from 'src/decorators/pagination.decorator';
import { UserData } from 'src/decorators/userData.decorator';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { StudentAssignmentDetailsResponse } from 'src/models/student-assignment-details-response';
import { PrismaService } from 'src/prisma.service';
import { FileUploadService } from 'src/services/file-upload.service';

class CreateAssignmentsDTO {
  @IsNumber({}, { each: true })
  reading_ids: number[];
  @IsDateString()
  due_date: string;
}

@Controller('evaluationGroups')
export class EvaluationGroupsController {
  constructor(
    private prismaService: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  @Get('/')
  @UseGuards(TeacherGuard)
  async getAll(
    @UserData('id') userId: number,
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<{ data: EvaluationGroup[] }> {
    const evaluationGroups = await this.prismaService.evaluationGroup.findMany({
      where: {
        Teacher: {
          id: userId,
        },
      },
      skip: page * pageSize,
      take: pageSize,
    });
    return { data: evaluationGroups };
  }

  @Get('/:evaluationGroupId')
  @UseGuards(TeacherGuard)
  async getOne(
    @UserData('id') userId: number,
    @Param('evaluationGroupId') evaluationGroupId: string,
  ) {
    const evaluationGroup = await this.prismaService.evaluationGroup.findFirst({
      where: {
        id: Number(evaluationGroupId),
        teacher_id: userId,
      },
      include: {
        Students: {
          select: {
            id: true,
            cedula: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        EvaluationGroupReadings: {
          include: {
            Recordings: true,
            Reading: true,
          },
        },
      },
    });
    if (!evaluationGroup) {
      throw new UnprocessableEntityException('Evaluation group not found');
    }

    const students = evaluationGroup.Students.map((s) => ({
      ...s,
      assignments_done: 0,
      assignments_pending: 0,
    }));

    evaluationGroup.EvaluationGroupReadings.forEach((reading) => {
      const doneStudentsMap = {};
      reading.Recordings.forEach((recording) => {
        doneStudentsMap[recording.student_id] = true;
      });
      students.forEach((student) => {
        if (doneStudentsMap[student.id]) {
          student.assignments_done += 1;
        } else {
          student.assignments_pending += 1;
        }
      });
    });

    return {
      id: evaluationGroup.id,
      name: evaluationGroup.name,
      school_data: evaluationGroup.school_data,
      school_year: evaluationGroup.school_year,
      teacher_id: evaluationGroup.teacher_id,
      created_by: evaluationGroup.created_by,
      Students: students,
      Assignments: evaluationGroup.EvaluationGroupReadings.map((r) => ({
        evaluation_group_reading_id: r.id,
        reading_id: r.Reading.id,
        reading_title: r.Reading.title,
        reading_category: r.Reading.category,
        reading_subcategory: r.Reading.subcategory,
        due_date: r.due_date,
        done: r.Recordings.length,
        pending: students.length - r.Recordings.length,
      })),
    };
  }

  @Post('/:evaluationGroupId/assignments')
  @UseGuards(TeacherGuard)
  async createAssignment(
    @UserData('id') userId: number,
    @Param('evaluationGroupId') evaluationGroupId: string,
    @Body() createDTO: CreateAssignmentsDTO,
  ) {
    const evaluationGroup = await this.prismaService.evaluationGroup.findUnique(
      {
        where: { id: Number(evaluationGroupId) },
      },
    );
    if (!evaluationGroup || evaluationGroup.teacher_id !== userId) {
      throw new UnprocessableEntityException('Evaluation group not found');
    }
    const readings = await this.prismaService.reading.findMany({
      where: { id: { in: createDTO.reading_ids } },
    });
    if (readings.length !== createDTO.reading_ids.length) {
      throw new UnprocessableEntityException('Some reading was not found');
    }
    const assignments =
      await this.prismaService.evaluationGroupReading.createMany({
        data: readings.map((reading) => {
          return {
            evaluation_group_id: evaluationGroup.id,
            reading_id: reading.id,
            due_date: createDTO.due_date,
            // TODO add created_by column in db, and store `userId` in it
          };
        }),
      });
    return assignments;
  }

  @Get('/:evaluationGroupId/stats')
  @UseGuards(TeacherGuard)
  async getGroupStats(
    @Param('evaluationGroupId') evaluationGroupId: string,
    @Query('dateFrom') dateFromRaw: string,
    @Query('dateTo') dateToRaw: string,
  ) {
    const dateFrom = dayjs(dateFromRaw, 'YYYY-MM-DD');
    const dateTo = dayjs(dateToRaw, 'YYYY-MM-DD');

    const evaluationGroup = await this.prismaService.evaluationGroup.findUnique(
      {
        where: {
          id: Number(evaluationGroupId),
        },
      },
    );
    if (!evaluationGroup) {
      throw new UnprocessableEntityException('Evaluation group not found');
    }

    const assignmentsDoneCount =
      await this.prismaService.evaluationGroupReading.count({
        where: {
          evaluation_group_id: evaluationGroup.id,
          Recordings: {
            some: {
              created_at: {
                gte: dateFrom.toISOString(),
                lte: dateTo.toISOString(),
              },
            },
          },
        },
      });

    const now = new Date();
    const inDateRangeCondition = {
      AND: [
        { created_at: { lte: dateTo.toISOString() } },
        { due_date: { gte: dateFrom.toISOString() } },
      ],
    };

    const assignmentsPendingCount =
      await this.prismaService.evaluationGroupReading.count({
        where: {
          evaluation_group_id: evaluationGroup.id,
          due_date: {
            gt: now,
          },
          Recordings: {
            none: {},
          },
          ...inDateRangeCondition,
        },
      });

    const assignmentsDelayedCount =
      await this.prismaService.evaluationGroupReading.count({
        where: {
          evaluation_group_id: evaluationGroup.id,
          due_date: {
            lt: now,
          },
          Recordings: {
            none: {},
          },
          ...inDateRangeCondition,
        },
      });

    const monthlyAverages = (await this.prismaService.$queryRaw`
      SELECT
        DATE_TRUNC('month', egr.created_at) as month,
        AVG(a.score) as average_score,
        CAST(COUNT(DISTINCT CASE WHEN r.id IS NOT NULL THEN egr.id END) AS INTEGER) as assignments_done,
        CAST(COUNT(DISTINCT CASE WHEN r.id IS NULL AND egr.due_date > NOW() THEN egr.id END) AS INTEGER) as assignments_pending,
        CAST(COUNT(DISTINCT CASE WHEN r.id IS NULL AND egr.due_date <= NOW() THEN egr.id END) AS INTEGER) as assignments_delayed
      FROM "EvaluationGroupReading" egr
      LEFT JOIN "Recording" r ON egr.id = r.evaluation_group_reading_id
      LEFT JOIN "Analysis" a ON r.id = a.recording_id
      WHERE egr.evaluation_group_id = ${evaluationGroup.id}
      GROUP BY DATE_TRUNC('month', egr.created_at)
      ORDER BY month;
    `) as {
      month: Date;
      average_score: number;
      assignments_done: number;
      assignments_pending: number;
      assignments_delayed: number;
    }[];

    return {
      assignments_done: assignmentsDoneCount,
      assignments_pending: assignmentsPendingCount,
      assignments_delayed: assignmentsDelayedCount,
      monthly_score_averages: monthlyAverages.map((m) => ({
        month: m.month,
        average_score: m.average_score || 0,
      })),
      monthly_assignments_done: monthlyAverages.map((m) => ({
        month: m.month,
        assignments_done: m.assignments_done || 0,
      })),
      monthly_assignments_pending: monthlyAverages.map((m) => ({
        month: m.month,
        assignments_pending: m.assignments_pending || 0,
      })),
      monthly_assignments_delayed: monthlyAverages.map((m) => ({
        month: m.month,
        assignments_delayed: m.assignments_delayed || 0,
      })),
    };
  }

  @Get('/:evaluationGroupId/students/:studentId')
  @UseGuards(TeacherGuard)
  async getStudent(
    @UserData('id') userId: number,
    @Param('evaluationGroupId') evaluationGroupId: string,
    @Param('studentId') studentId: string,
    @Query('dateFrom') dateFromRaw: string,
    @Query('dateTo') dateToRaw: string,
  ) {
    const dateFrom = dayjs(dateFromRaw, 'YYYY-MM-DD');
    const dateTo = dayjs(dateToRaw, 'YYYY-MM-DD');
    const evaluationGroup = await this.prismaService.evaluationGroup.findFirst({
      where: {
        id: Number(evaluationGroupId),
        teacher_id: userId,
      },
    });
    if (!evaluationGroup) {
      throw new UnprocessableEntityException('Evaluation group not found');
    }

    const student = await this.prismaService.student.findFirst({
      where: {
        id: Number(studentId),
        EvaluationGroups: {
          some: {
            id: evaluationGroup.id,
          },
        },
      },
    });
    if (!student) {
      throw new UnprocessableEntityException('Student not found');
    }

    const assignments =
      await this.prismaService.evaluationGroupReading.findMany({
        where: {
          evaluation_group_id: evaluationGroup.id,
        },
        include: {
          Reading: true,
          Recordings: {
            where: {
              student_id: student.id,
            },
            include: {
              Analysis: true,
            },
          },
        },
      });

    let doneAssignmentsCount = 0; // has recording
    let pendingAssignmentsCount = 0; // no recording, due_date > now
    let delayedAssignmentsCount = 0; // no recording, due_date <= now

    const averagesDataMap = {
      score: { sum: 0, count: 0 },
      silences_count: { sum: 0, count: 0 },
      repetitions_count: { sum: 0, count: 0 },
      similarity_error: { sum: 0, count: 0 },
    };

    const addAverage = (key: string, value: number) => {
      averagesDataMap[key].sum += value;
      averagesDataMap[key].count += 1;
    };

    assignments.forEach(({ Recordings, created_at, due_date }) => {
      if (Recordings.length === 0) {
        const outOfRange =
          dayjs(created_at).isAfter(dateTo) ||
          dayjs(due_date).isBefore(dateFrom);
        if (!outOfRange) {
          if (dayjs().isAfter(due_date)) {
            delayedAssignmentsCount += 1;
          } else {
            pendingAssignmentsCount += 1;
          }
        }
      } else {
        const lastRecording = Recordings[Recordings.length - 1];
        const recordingDate = dayjs(lastRecording.created_at);
        const isInDateRange =
          recordingDate.isAfter(dateFrom) && recordingDate.isBefore(dateTo);

        if (isInDateRange) {
          doneAssignmentsCount += 1;

          const lastAnalysis = lastRecording.Analysis.length
            ? lastRecording.Analysis[lastRecording.Analysis.length - 1]
            : null;

          const isAnalysisCompleted =
            lastAnalysis && lastAnalysis.status === AnalysisStatus.COMPLETED;
          if (isAnalysisCompleted) {
            addAverage('score', lastAnalysis.score);
            addAverage('silences_count', lastAnalysis.silences_count);
            addAverage('repetitions_count', lastAnalysis.repetitions_count);
            addAverage('similarity_error', lastAnalysis.similarity_error);
          }
        }
      }
    });

    const getAverage = (key: string) => {
      return averagesDataMap[key].sum / averagesDataMap[key].count;
    };

    // Prisma does not support GROUP BY month for dates, so we have to use raw SQL
    const monthlyAverages = await this.prismaService.$queryRaw`
      SELECT
        DATE_TRUNC('month', a.created_at) as month,
        AVG(a.score) FILTER (WHERE r.student_id = ${student.id}) as student_avg_score,
        AVG(a.score) as group_avg_score
      FROM "Analysis" a
      JOIN "Recording" r ON a.recording_id = r.id
      JOIN "Student" s ON r.student_id = s.id
      JOIN "EvaluationGroupReading" egr ON r.evaluation_group_reading_id = egr.id
      JOIN "EvaluationGroup" eg ON egr.evaluation_group_id = eg.id
      WHERE eg.id = ${evaluationGroup.id}
      GROUP BY DATE_TRUNC('month', a.created_at)
      ORDER BY month;
    `;

    return {
      assignments_done: doneAssignmentsCount,
      assignments_pending: pendingAssignmentsCount,
      assignments_delayed: delayedAssignmentsCount,
      average_score: getAverage('score'),
      Assignments: assignments.map((a) => {
        const lastRecording = a.Recordings.length
          ? a.Recordings[a.Recordings.length - 1]
          : null;
        return {
          id: a.id,
          reading_category: a.Reading.category,
          reading_subcategory: a.Reading.subcategory,
          reading_id: a.Reading.id,
          reading_title: a.Reading.title,
          recording_id: lastRecording ? lastRecording.id : null,
          due_date: a.due_date,
          score: lastRecording ? lastRecording.Analysis.length : 0,
          status: lastRecording
            ? 'completed'
            : a.due_date < new Date()
            ? 'delayed'
            : 'pending',
        };
      }),
      monthly_averages: monthlyAverages,
      average_errors: {
        silences_count: getAverage('silences_count'),
        repetitions_count: getAverage('repetitions_count'),
        general_errors: getAverage('similarity_error'),
      },
      student_name: `${student.first_name} ${student.last_name}`,
      student_id: student.id,
      group_name: evaluationGroup.name,
      group_id: evaluationGroup.id,
    };
  }

  @Get('/:evaluationGroupId/assignments/:evaluationGroupReadingId')
  @UseGuards(TeacherGuard)
  async getAssignment(
    @UserData('id') userId: number,
    @Param('evaluationGroupId') evaluationGroupId: string,
    @Param('evaluationGroupReadingId') evaluationGroupReadingId: string,
  ) {
    const evaluationGroup = await this.prismaService.evaluationGroup.findFirst({
      where: {
        id: parseInt(evaluationGroupId),
        teacher_id: userId,
      },
    });
    if (!evaluationGroup) {
      throw new UnprocessableEntityException('Evaluation group not found');
    }

    const evaluationGroupReading =
      await this.prismaService.evaluationGroupReading.findFirst({
        where: {
          id: parseInt(evaluationGroupReadingId),
          evaluation_group_id: parseInt(evaluationGroupId),
        },
        include: {
          Reading: true,
        },
      });
    if (!evaluationGroupReading) {
      throw new UnprocessableEntityException(
        'Evaluation group reading not found',
      );
    }
    const averageScore = await this.prismaService.analysis.aggregate({
      _avg: {
        score: true,
      },
      where: {
        Recording: {
          evaluation_group_reading_id: Number(evaluationGroupReadingId),
        },
      },
    });

    const doneAssignments = await this.prismaService.recording.findMany({
      distinct: ['student_id'],
      select: {
        student_id: true,
      },
      where: {
        evaluation_group_reading_id: Number(evaluationGroupReadingId),
      },
    });

    const doneAssignmentsCount = doneAssignments.length;

    const allEvaluationGroupReadingStudents =
      await this.prismaService.student.count({
        where: {
          EvaluationGroups: {
            some: {
              id: Number(evaluationGroupId),
            },
          },
        },
      });

    const doneRecordings = await this.prismaService.recording.findMany({
      where: {
        evaluation_group_reading_id: Number(evaluationGroupReadingId),
      },
      include: {
        Student: true,
        Analysis: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      distinct: ['student_id'],
    });

    const averageErrors = await this.prismaService.analysis.aggregate({
      _avg: {
        silences_count: true,
        repetitions_count: true,
        similarity_error: true,
      },
      where: {
        Recording: {
          evaluation_group_reading_id: Number(evaluationGroupReadingId),
        },
      },
    });

    const mostRepeatedWords = await this.prismaService.$queryRaw`
      SELECT word, COUNT(*)::integer AS repetition_count
      FROM (
        SELECT unnest(words_with_repetitions) AS word
        FROM "Analysis" analysis
	      JOIN "Recording" recording ON analysis.recording_id = recording.id
	      AND recording.evaluation_group_reading_id = ${evaluationGroupReading.id}
      ) AS word_list
      GROUP BY word
      ORDER BY repetition_count DESC
      LIMIT(6);
    `;

    const {
      Reading: { title, category, subcategory, id },
      due_date,
      created_at,
    } = evaluationGroupReading;

    const { similarity_error, repetitions_count, silences_count } =
      averageErrors._avg;

    const isOpen =
      evaluationGroupReading.due_date.getTime() > new Date().getTime();

    return {
      assignment: {
        id: evaluationGroupReading.id,
        due_date,
        created_at,
        reading: {
          id,
          title,
          category,
          subcategory,
        },
      },
      assignments_done: doneAssignmentsCount,
      assignments_pending:
        allEvaluationGroupReadingStudents - doneAssignmentsCount,
      isOpen,
      average_score: averageScore._avg.score || 0,
      recordings: doneRecordings.map(({ Student, Analysis, created_at }) => {
        const lastRecording = Analysis.length
          ? Analysis[Analysis.length - 1]
          : null;
        return {
          studentName: `${Student.first_name} ${Student.last_name}`,
          studentId: Student.id,
          cedula: Student.cedula,
          email: Student.email,
          status: lastRecording.status,
          dateSubmitted: created_at,
        };
      }),
      average_errors: {
        repetitions_count,
        silences_count,
        general_errors: similarity_error,
      },
      most_repeated_words: mostRepeatedWords,
      group_id: evaluationGroup.id,
      group_name: evaluationGroup.name,
    };
  }

  @Get('/assignments/:evaluationGroupReadingId/:studentId')
  @UseGuards(TeacherGuard)
  async getStudentAssignmentDetail(
    @UserData('id') userId: number,
    @Param('evaluationGroupReadingId') evaluationGroupReadingId: string,
    @Param('studentId') studentId: string,
  ): Promise<StudentAssignmentDetailsResponse> {
    const evaluationGroupReading =
      await this.prismaService.evaluationGroupReading.findFirst({
        where: {
          id: Number(evaluationGroupReadingId),
          EvaluationGroup: {
            teacher_id: userId,
            Students: {
              some: {
                id: Number(studentId),
              },
            },
          },
        },
        include: {
          Reading: true,
          EvaluationGroup: true,
        },
      });

    if (!evaluationGroupReading) {
      throw new UnprocessableEntityException('Reading not found');
    }

    const recording = await this.prismaService.recording.findFirst({
      where: {
        student_id: Number(studentId),
        EvaluationGroupReading: {
          id: Number(evaluationGroupReadingId),
          EvaluationGroup: {
            teacher_id: userId,
          },
        },
      },
      include: {
        Analysis: true,
      },
    });

    const student = await this.prismaService.student.findFirstOrThrow({
      where: {
        id: Number(studentId),
      },
    });

    return {
      analysis_id: recording?.Analysis[0]?.id ?? null,
      student_id: student.id,
      student_name: `${student.first_name} ${student.last_name}`,
      evaluation_group_reading_id: evaluationGroupReading.id,
      reading_id: evaluationGroupReading.Reading.id,
      reading_title: evaluationGroupReading.Reading.title,
      category: evaluationGroupReading.Reading.category,
      subcategory: evaluationGroupReading.Reading.subcategory,
      group_id: evaluationGroupReading.EvaluationGroup.id,
      group_name: evaluationGroupReading.EvaluationGroup.name,
      score: recording?.Analysis[0]?.score ?? null,
      words_velocity: recording?.Analysis[0]?.words_velocity ?? null,
      silences_count: recording?.Analysis[0]?.silences_count ?? null,
      repetitions_count: recording?.Analysis[0]?.repetitions_count ?? null,
      recording_id: recording?.id,
      recording_url: recording?.recording_url
        ? await this.fileUploadService.getSignedUrl(recording.recording_url)
        : null,
      status: recording
        ? 'completed'
        : evaluationGroupReading.due_date < new Date()
        ? 'delayed'
        : 'pending',
      analysis_status: recording?.Analysis[0]?.status ?? 'PENDING',
    };
  }
}
