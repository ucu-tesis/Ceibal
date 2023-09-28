import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EvaluationGroup } from '@prisma/client';
import { Pagination } from 'src/decorators/pagination.decorator';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/services/user.service';

@Controller('evaluationGroups')
export class EvaluationGroupsController {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
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
          id: user.id,
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
    const evaluationGroup =
      await this.prismaService.evaluationGroup.findFirstOrThrow({
        where: {
          id: Number(evaluationGroupId),
          teacher_id: this.userService.get().id,
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
