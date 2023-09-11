import { Controller, Get, Param, Query } from '@nestjs/common';
import { EvaluationGroup } from '@prisma/client';
import { Pagination } from 'src/decorators/pagination.decorator';
import { PrismaService } from 'src/prisma.service';

@Controller('evaluationGroups')
export class EvaluationGroupsController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  // @UseGuards(AuthGuard)
  async getAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
    @Query('ci') ci: string, // TODO remove after adding sso
  ): Promise<EvaluationGroup[]> {
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
    @Param('evaluationGroupId') evaluationGroupId: string,
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
