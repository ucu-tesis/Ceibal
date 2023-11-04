import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload.service';
import { File } from 'multer';
import { Recording } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';
import { StudentGuard } from 'src/guards/student.guard';
import { UserData } from 'src/decorators/userData.decorator';

@Controller('recordings')
export class RecordingsController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private prismaService: PrismaService,
  ) {}

  // TODO consider moving this to a "student" controller with all other student-facing logic
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(StudentGuard)
  async upload(
    @UserData('id') userId: number,
    @UploadedFile() file: File,
  ): Promise<{ path: string; data: any }> {
    return this.fileUploadService.uploadFileToS3(file, userId);
  }

  @Get('/')
  @UseGuards(StudentGuard)
  async getAll(
    @UserData('id') userId: number,
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<{ data: Recording[] }> {
    const recordings = await this.prismaService.recording.findMany({
      where: {
        student_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: page * pageSize,
      take: pageSize,
    });
    return { data: recordings };
  }

  @Get('/:recordingId')
  @UseGuards(StudentGuard)
  async getOne(
    @UserData('id') userId: number,
    @Param('recordingId') recordingId: string,
  ): Promise<Recording> {
    const recording = await this.prismaService.recording.findFirstOrThrow({
      where: {
        id: Number(recordingId),
        student_id: userId,
      },
      include: {
        Analysis: true,
      },
    });
    return recording;
  }
}
