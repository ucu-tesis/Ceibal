import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  category: string;
  @IsString()
  @IsOptional()
  subcategory?: string;
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
    const where = {
      OR: [{ is_public: true }, { created_by: userId }],
    };
    const readings = await this.prismaService.reading.findMany({
      where,
      skip: page * pageSize,
      take: pageSize,
    });
    const totalReadings = await this.prismaService.reading.count({ where });
    return {
      Readings: readings,
      page,
      page_size: pageSize,
      total: totalReadings,
    };
  }

  @Get('/categories')
  @UseGuards(TeacherGuard)
  async getAllCategories(@UserData('id') userId: number) {
    const categories : Array<{ category: string }> = await this.prismaService.$queryRaw`
      Select DISTINCT category from "Reading"
      where is_public = true or created_by = ${userId}
    `;
    const subcategories: Array<{ subcategory: string }> = await this.prismaService.$queryRaw`
      Select DISTINCT subcategory from "Reading"
      where is_public = true or created_by = ${userId}
    `;
    return {
      categories: categories.map(c => c.category),
      subcategories: subcategories.map(sc => sc.subcategory),
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
        category: createDTO.category,
        subcategory: createDTO.subcategory,
        image_url: createDTO.image_url,
        created_by: userId,
        is_public: false,
      },
    });
    return reading;
  }
}
