import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { Analysis } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Request } from 'express';
import { Pagination } from 'src/decorators/pagination.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/user.service';

// TODO consider converting this into a "student" controller with all other student-facing logic
@Controller('analysis')
export class AnalysisController {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  @Get('/')
  @UseGuards(StudentGuard)
  async studentGetAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
    @Query('request') request: Request,
  ): Promise<{ data: Analysis[] }> {
    const user = this.userService.get();

    const analyses = await this.prismaService.analysis.findMany({
      where: {
        Recording: {
          Student: {
            cedula: user.ci,
          },
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
          Student: {
            cedula: user.ci,
          },
        },
      },
    });

    if (!analysis) {
      throw new NotFoundException('Analysis not found');
    }

    return analysis;
  }
}
