import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { EvaluationGroup } from '@prisma/client';
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
    @Query('page') page: number,
    @Query('pageSize') pageSize: number, // TODO fix passing as query param
  ): Promise<EvaluationGroup[]> {
    if (!page) page = 0;
    if (!pageSize) pageSize = 20;

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
    return evaluationGroups;
  }

  @Get('/:evaluationGroupId')
  @UseGuards(TeacherGuard)
  async getOne(
    @Param('evaluationGroupId') evaluationGroupId: number,
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
