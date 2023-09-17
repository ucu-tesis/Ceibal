import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { PrismaService } from 'src/prisma.service';

@Controller('teachers')
export class TeachersController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  @UseGuards(TeacherGuard)
  async getAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<User[]> {
    if (!page) page = 0;
    if (!pageSize) pageSize = 20;
    const users = await this.prismaService.user.findMany({
      skip: page * pageSize,
      take: pageSize,
    });
    return users.map((user) => {
      user.password_hash = undefined;
      return user;
    });
  }
}
