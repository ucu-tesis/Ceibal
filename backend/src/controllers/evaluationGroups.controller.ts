import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get('/:evaluationGroupId')
  // @UseGuards(AuthGuard)
  async getOne(
    @Param('evaluationGroupId') evaluationGroupId: number,
  ): Promise<EvaluationGroup> {
    const evaluationGroup =
      await this.prismaService.evaluationGroup.findUniqueOrThrow({
        where: {
          id: Number(evaluationGroupId),
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
        },
      });
    return evaluationGroup;
  }
}
