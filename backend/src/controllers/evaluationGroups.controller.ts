import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EvaluationGroup } from '@prisma/client';
import { Pagination } from 'src/decorators/pagination.decorator';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/user.service';

@Controller('evaluationGroups')
export class EvaluationGroupsController {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}

  @Get('/')
  @UseGuards(TeacherGuard)
  async getAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<{ data: EvaluationGroup[] }> {
    const user = this.userService.get();

    const evaluationGroups = await this.prismaService.evaluationGroup.findMany({
      where: {
        Teacher: {
          cedula: user.ci,
        },
      },
      skip: page * pageSize,
      take: pageSize,
    });
    return { data: evaluationGroups };
  }

  @Get('/:evaluationGroupId')
  @UseGuards(TeacherGuard)
  async getOne(
    @Param('evaluationGroupId') evaluationGroupId: string,
  ): Promise<EvaluationGroup> {
    // TODO: Acá falta validar que el grupo de evaluación pertenezca al maestro
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
