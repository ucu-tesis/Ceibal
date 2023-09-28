import {
  Controller,
  Get,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Analysis } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { UserService } from 'src/services/user.service';

// TODO consider converting this into a "student" controller with all other student-facing logic
@Controller('analysis')
export class AnalysisController {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  @Get('/')
  @UseGuards(StudentGuard)
  async studentGetAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<{ data: Analysis[] }> {
    const user = this.userService.get();

    const analyses = await this.prismaService.analysis.findMany({
      where: {
        Recording: {
          student_id: user.id,
        },
      },
      skip: page * pageSize,
      take: pageSize,
      orderBy: {
        created_at: 'desc',
      },
    });

    return { data: analyses };
  }

  @Get('/:analysisId')
  @UseGuards(StudentGuard)
  async studentGetSingle(
    @Param('analysisId') analysisId: number,
  ): Promise<Analysis> {
    const user = this.userService.get();

    const analysis = await this.prismaService.analysis.findFirst({
      where: {
        id: analysisId,
        Recording: {
          student_id: user.id,
        },
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return analysis;
  }
}
