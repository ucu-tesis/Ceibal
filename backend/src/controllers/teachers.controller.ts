import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { UserService } from 'src/services/user.service';
import { RecordingDetailResponse } from 'src/models/recording-detail-response.model';

@Controller('teachers')
export class TeachersController {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  @Get('/')
  @UseGuards(TeacherGuard)
  async getAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<{ data: User[] }> {
    const users = await this.prismaService.user.findMany({
      skip: page * pageSize,
      take: pageSize,
    });
    return {
      data: users.map((user) => {
        user.password_hash = undefined;
        return user;
      }),
    };
  }

  @Get('/recordings/:id')
  @UseGuards(TeacherGuard)
  async getAnalysis(@Param('id') id: string): Promise<RecordingDetailResponse> {
    const user = this.userService.get();
    const recording = await this.prismaService.recording.findFirstOrThrow({
      where: {
        id: Number(id),
        EvaluationGroupReading: {
          EvaluationGroup: {
            teacher_id: user.id,
          },
        },
      },
      include: {
        Analysis: true,
        Student: true,
        EvaluationGroupReading: {
          include: {
            Reading: true,
          },
        },
      },
    });
    return {
      analysis_id: recording.Analysis[0].id,
      student_id: recording.student_id,
      student_first_name: recording.Student.first_name,
      student_last_name: recording.Student.last_name,
      reading_id: recording.EvaluationGroupReading.Reading.id,
      reading_title: recording.EvaluationGroupReading.Reading.title,
      category: recording.EvaluationGroupReading.Reading.category,
      subcategory: recording.EvaluationGroupReading.Reading.subcategory,
      metrics: {
        // TODO: No definido aun.
      },
    };
  }
}
