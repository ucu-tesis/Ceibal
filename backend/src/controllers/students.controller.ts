import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { UserService } from 'src/services/user.service';
import { ReadingsResponse } from 'src/models/reading-response.model';
import { PendingReadingsResponse } from 'src/models/pending-reading-response.model';

@Controller('students')
export class StudentsController {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  @Get('/readings/completed')
  @UseGuards(StudentGuard)
  async getReadings(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<ReadingsResponse> {
    const user = this.userService.get();

    const recordings = await this.prismaService.recording.findMany({
      where: {
        student_id: user.id,
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

    const totalReadings = await this.prismaService.recording.count({
      where: {
        student_id: user.id,
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
          image: r.EvaluationGroupReading.Reading.imageUrl,
          score: newestAnalysis?.score || 0,
          status: newestAnalysis?.status || 'NOT_STARTED',
        };
      }),
      total: totalReadings,
      page: page,
      page_size: pageSize,
    };
  }

  @Get('/readings/pending')
  @UseGuards(StudentGuard)
  async getPendingReadings(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<PendingReadingsResponse> {
    const user = this.userService.get();

    const readings = await this.prismaService.evaluationGroupReading.findMany({
      where: {
        EvaluationGroup: {
          Students: {
            some: {
              id: user.id,
            },
          },
        },
        Recording: {
          none: {},
        },
      },
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
        where: {
          EvaluationGroup: {
            Students: {
              some: {
                id: user.id,
              },
            },
          },
          Recording: {
            none: {},
          },
        },
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
  async getPendingReadingsAmount(): Promise<{ assignments_pending: number }> {
    const user = this.userService.get();

    const readings = await this.prismaService.evaluationGroupReading.count({
      where: {
        EvaluationGroup: {
          Students: {
            some: {
              id: user.id,
            },
          },
        },
        Recording: {
          none: {},
        },
      },
    });

    return {
      assignments_pending: readings,
    };
  }
}
