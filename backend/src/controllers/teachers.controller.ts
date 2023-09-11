import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';

@Controller('teachers')
export class TeachersController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  @UseGuards(AuthGuard)
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
}
