import { Controller, Get, Query } from '@nestjs/common';
import { EvaluationGroup } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Controller('evaluationGroups')
export class EvaluationGroupsController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  // @UseGuards(AuthGuard)
  async getAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number, // TODO fix passing as query param
    @Query('ci') ci: string, // TODO remove after adding sso
  ): Promise<EvaluationGroup[]> {
    if (!page) page = 0;
    if (!pageSize) pageSize = 20;

    if (!ci) {
      throw new Error('Must provide a filter');
    }

    const evaluationGroups = await this.prismaService.evaluationGroup.findMany({
      where: {
        Teacher: {
          cedula: ci,
        },
      },
      skip: page * pageSize,
      take: pageSize,
    });
    return evaluationGroups;
  }
}
