import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { UserService } from 'src/services/user.service';
import { ReadingsResponse } from 'src/models/reading-response.model';

@Controller('students')
export class StudentsController {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  @Get('/readings')
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
    };
  }
}
