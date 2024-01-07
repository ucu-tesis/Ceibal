import {
  Controller,
  Get,
  Param,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'src/decorators/pagination.decorator';
import { UserData } from 'src/decorators/userData.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { ReadingsResponse } from 'src/models/reading-response.model';
import { PrismaService } from 'src/prisma.service';

@Controller('students')
export class StudentsController {
  constructor(private prismaService: PrismaService) {}

  @Get('/readings/all')
  @UseGuards(StudentGuard)
  async getCategorizedReadings(@UserData('id') userId: number) {
    const student = await this.prismaService.student.findUnique({
      where: { id: userId },
      include: {
        EvaluationGroups: { include: { EvaluationGroupReadings: true } },
      },
    });
    const assignedReadings = student.EvaluationGroups.flatMap((eg) =>
      eg.EvaluationGroupReadings.map((egr) => egr.reading_id),
    );
    const allReadings = await this.prismaService.reading.findMany({
      where: {
        OR: [
          { is_public: true },
          { id: { in: [...new Set(assignedReadings)] } },
        ],
      },
    });

    const categories: Array<{
      category: string;
      subcategories: Array<{
        subcategory: string;
        readings: Array<{ reading_id: number; title: string }>;
      }>;
    }> = [];

    allReadings.forEach((r) => {
      let category = categories.find((c) => c.category == r.category);
      if (!category) {
        category = { category: r.category, subcategories: [] };
        categories.push(category);
      }
      let subcategory = category.subcategories.find(
        (sc) => sc.subcategory == r.subcategory,
      );
      if (!subcategory) {
        subcategory = { subcategory: r.subcategory, readings: [] };
        category.subcategories.push(subcategory);
      }
      subcategory.readings.push({ reading_id: r.id, title: r.title });
    });

    return categories;
  }

  @Get('/readings/completed')
  @UseGuards(StudentGuard)
  async getCompletedReadings(
    @UserData('id') userId: number,
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<ReadingsResponse> {
    const recordings = await this.prismaService.recording.findMany({
      where: {
        student_id: userId,
      },
      include: {
        Analysis: true,
        EvaluationGroupReading: {
          include: {
            Reading: true,
          },
        },
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        created_at: 'desc',
      },
    });

    const totalRecordings = await this.prismaService.recording.count({
      where: {
        student_id: userId,
      },
    });

    return {
      Recordings: recordings.map((r) => {
        const newestAnalysis = r.Analysis.length
          ? r.Analysis[r.Analysis.length - 1]
          : null;
        return {
          id: r.id,
          date_submitted: r.created_at,
          reading_title: r.EvaluationGroupReading.Reading.title,
          reading_image: r.EvaluationGroupReading.Reading.image_url,
          analysis_score: newestAnalysis?.score || 0,
          analysis_status: newestAnalysis?.status || 'NOT_STARTED',
        };
      }),
      total: totalRecordings,
      page: page,
      page_size: pageSize,
    };
  }

  @Get('/readings/pending')
  @UseGuards(StudentGuard)
  async getPendingReadings(@UserData('id') userId: number) {
    const where = {
      EvaluationGroup: {
        Students: {
          some: {
            id: userId,
          },
        },
      },
      Recordings: {
        none: {},
      },
    };

    const readings = await this.prismaService.evaluationGroupReading.findMany({
      where: where,
      include: {
        Reading: true,
      },
      orderBy: {
        due_date: 'asc',
      },
    });

    const assignments = readings.map((r) => ({
      due_date: r.due_date,
      reading_category: r.Reading.category,
      reading_id: r.id,
      reading_subcategory: r.Reading.subcategory,
      reading_title: r.Reading.title,
    }));

    const categories: Array<{
      category: string;
      subcategories: Array<{
        subcategory: string;
        readings: Array<{ reading_id: number; title: string; due_date: Date }>;
      }>;
    }> = [];

    assignments.forEach((a) => {
      let category = categories.find((c) => c.category == a.reading_category);
      if (!category) {
        category = { category: a.reading_category, subcategories: [] };
        categories.push(category);
      }
      let subcategory = category.subcategories.find(
        (sc) => sc.subcategory == a.reading_subcategory,
      );
      if (!subcategory) {
        subcategory = { subcategory: a.reading_subcategory, readings: [] };
        category.subcategories.push(subcategory);
      }
      subcategory.readings.push({
        reading_id: a.reading_id,
        title: a.reading_title,
        due_date: a.due_date,
      });
    });

    return categories;
  }

  @Get('/readings/pending-amount')
  @UseGuards(StudentGuard)
  async getPendingReadingsAmount(
    @UserData('id') userId: number,
  ): Promise<{ assignments_pending: number }> {
    const readings = await this.prismaService.evaluationGroupReading.count({
      where: {
        EvaluationGroup: {
          Students: {
            some: {
              id: userId,
            },
          },
        },
        Recordings: {
          none: {},
        },
      },
    });

    return {
      assignments_pending: readings,
    };
  }
  @Get('/readings/details/:readingId')
  @UseGuards(StudentGuard)
  async getReadingDetails(
    @UserData('id') userId: number,
    @Param('readingId') readingId: string,
  ) {
    const assignment =
      await this.prismaService.evaluationGroupReading.findFirst({
        where: {
          reading_id: Number(readingId),
          EvaluationGroup: {
            Students: {
              some: {
                id: userId,
              },
            },
          },
        },
        include: {
          Reading: true,
        },
      });

    if (!assignment) {
      throw new UnprocessableEntityException('Reading not found/assigned');
    }

    return {
      reading_id: assignment.Reading.id,
      reading_title: assignment.Reading.title,
      reading_content: assignment.Reading.content,
      reading_category: assignment.Reading.category,
      reading_subcategory: assignment.Reading.subcategory,
      evaluation_group_reading_id: assignment.id,
    };
  }
}
