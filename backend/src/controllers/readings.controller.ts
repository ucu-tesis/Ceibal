import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Reading } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { Pagination } from 'src/decorators/pagination.decorator';
import { UserData } from 'src/decorators/userData.decorator';
import { TeacherGuard } from 'src/guards/teacher.guard';
import { PrismaService } from 'src/prisma.service';

class CreateReadingDTO {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  @IsOptional()
  image_url?: string;
}

@Controller('readings')
export class ReadingsController {
  constructor(private prismaService: PrismaService) {}

  @Get('/')
  @UseGuards(TeacherGuard)
  async getAll(
    @UserData('id') userId: number, // TODO include readings created by the requesting teacher
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ) {
    const readings = await this.prismaService.reading.findMany({
      skip: page * pageSize,
      take: pageSize,
    });
    const totalReadings = await this.prismaService.reading.count();
    return {
      Readings: readings,
      page,
      page_size: pageSize,
      total: totalReadings,
    };
  }

  @Post('/')
  @UseGuards(TeacherGuard)
  async createReading(
    @UserData('id') userId: number,
    @Body() createDTO: CreateReadingDTO,
  ) {
    const reading = await this.prismaService.reading.create({
      data: {
        title: createDTO.title,
        content: createDTO.content,
        // TODO section
        // TODO created_by
        // TODO image_url
      },
    });
    return reading;
  }
}
