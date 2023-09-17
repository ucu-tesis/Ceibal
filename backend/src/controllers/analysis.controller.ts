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
import { StudentGuard } from 'src/guards/student.guard';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/user.service';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  @Get('/')
  @UseGuards(StudentGuard)
  async studentGetAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<Analysis[]> {
    if (!page) page = 0;
    if (!pageSize) pageSize = 20;

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

    return analyses;
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
