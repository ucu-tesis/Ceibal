import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { EvaluationGroup } from '@prisma/client';
import { IsDateString, IsNumber } from 'class-validator';
import { Pagination } from 'src/decorators/pagination.decorator';
import { UserData } from 'src/decorators/userData.decorator';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { PrismaService } from 'src/prisma.service';

class CreateAssignmentDTO {
  @IsNumber()
  reading_id: number;
  @IsDateString()
  due_date: string;
}

@Controller('evaluationGroups')
export class EvaluationGroupsController {
  constructor(private prismaService: PrismaService) {}

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
          include: { Recording: true, Reading: true },
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
      reading.Recording.forEach((recording) => {
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
        // TODO chapter: r.Reading.chapter, add `chapter` to db schema
        // TODO section: r.Reading.section, add `section` to db schema
        // TODO due_date: r.due_date, wait for student-readings-api PR to be merged
      })),
    };
  }

  @Post('/:evaluationGroupId/assignments')
  @UseGuards(TeacherGuard)
  async createAssignment(
    @UserData('id') userId: number,
    @Param('evaluationGroupId') evaluationGroupId: string,
    @Body() createDTO: CreateAssignmentDTO,
  ) {
    const evaluationGroup = await this.prismaService.evaluationGroup.findUnique(
      {
        where: { id: Number(evaluationGroupId) },
      },
    );
    if (!evaluationGroup || evaluationGroup.teacher_id !== userId) {
      throw new UnprocessableEntityException('Evaluation group not found');
    }
    const reading = await this.prismaService.reading.findUnique({
      where: { id: createDTO.reading_id },
    });
    if (!reading) {
      throw new UnprocessableEntityException('Reading not found');
    }
    const assignment = await this.prismaService.evaluationGroupReading.create({
      data: {
        evaluation_group_id: evaluationGroup.id,
        reading_id: reading.id,
        // due_date: createDTO.due_date, // TODO wait for due_date PR to be merged
        // TODO add created_by column in db, and store `userId` in it
      },
    });
    return assignment;
  }
}
