import {
  Controller,
  Get,
  Param,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { UserService } from 'src/services/user.service';
import { ReadingsResponse } from 'src/models/reading-response.model';
import { PendingReadingsResponse } from 'src/models/pending-reading-response.model';
import { UserData } from 'src/decorators/userData.decorator';

@Controller('students')
export class StudentsController {
  constructor(private prismaService: PrismaService) {}

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
      Readings: recordings.map((r) => {
        const newestAnalysis = r.Analysis.length
          ? r.Analysis[r.Analysis.length - 1]
          : null;
        return {
          id: r.id,
          date_submitted: r.created_at,
          title: r.EvaluationGroupReading.Reading.title,
          image: r.EvaluationGroupReading.Reading.image_url,
          score: newestAnalysis?.score || 0,
          status: newestAnalysis?.status || 'NOT_STARTED',
        };
      }),
      total: totalRecordings,
      page: page,
      page_size: pageSize,
    };
  }

  @Get('/readings/pending')
  @UseGuards(StudentGuard)
  async getPendingReadings(
    @UserData('id') userId: number,
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<PendingReadingsResponse> {
    const where = {
      EvaluationGroup: {
        Students: {
          some: {
            id: userId,
          },
        },
      },
      Recording: {
        none: {},
      },
    };

    const readings = await this.prismaService.evaluationGroupReading.findMany({
      where: where,
      include: {
        Reading: true,
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        due_date: 'asc',
      },
    });

    const totalReadings = await this.prismaService.evaluationGroupReading.count(
      {
        where: where,
      },
    );

    return {
      Assignments: readings.map((r) => {
        return {
          reading_id: r.id,
          reading_title: r.Reading.title,
          due_date: r.due_date,
        };
      }),
      total: totalReadings,
      page: page,
      page_size: pageSize,
    };
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
}
