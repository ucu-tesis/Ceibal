import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Analysis } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Request } from 'express';
import { Pagination } from 'src/decorators/pagination.decorator';

// TODO consider converting this into a "student" controller with all other student-facing logic
@Controller('analysis')
export class AnalysisController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  // @UseGuards(AuthGuard) // TODO: Habilitar login cuando se integre SSO
  async studentGetAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
    @Query('request') request: Request,
    @Query('ci') ci: string, // TODO: Eliminar cuando se integre SSO
  ): Promise<Analysis[]> {
    // TODO: const ci = request['user'].ci;

    const analyses = await this.prismaService.analysis.findMany({
      where: {
        Recording: {
          Student: {
            cedula: ci,
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
  // @UseGuards(AuthGuard) // TODO: Habilitar login cuando se integre SSO
  async studentGetSingle(
    @Param('analysisId') analysisId: number,
    @Query('request') request: Request,
    @Query('ci') ci: string, // TODO: Eliminar cuando se integre SSO
  ): Promise<Analysis> {
    // TODO: const ci = request['user'].ci;

    const analysis = await this.prismaService.analysis.findFirst({
      where: {
        id: analysisId,
        Recording: {
          Student: {
            cedula: ci,
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
