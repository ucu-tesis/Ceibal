import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload.service';
import { File } from 'multer';
import { Recording } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Pagination } from 'src/decorators/pagination.decorator';

@Controller('recordings')
export class RecordingsController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private prismaService: PrismaService,
  ) {}

  // TODO consider moving this to a "student" controller with all other student-facing logic
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: File,
  ): Promise<{ path: string; data: any }> {
    return this.fileUploadService.uploadFileToS3(file);
  }

  @Get('/')
  // @UseGuards(AuthGuard)
  async getAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
    @Query('studentId') studentId: string,
  ): Promise<{ data: Recording[] }> {
    if (!studentId) {
      throw new Error('Must provide studentId as part of the query');
    }
    // TODO throw error when student is not found + test it

    const recordings = await this.prismaService.recording.findMany({
      where: {
        student_id: Number(studentId),
      },
      // orderBy: {
      //   created_at: 'desc', // TODO add this column
      // },
      skip: page * pageSize,
      take: pageSize,
    });
    return { data: recordings };
  }

  @Get('/:recordingId')
  // @UseGuards(AuthGuard)
  async getOne(@Param('recordingId') recordingId: string): Promise<Recording> {
    const recording = await this.prismaService.recording.findUniqueOrThrow({
      where: {
        id: Number(recordingId),
      },
      include: {
        Analysis: true,
      },
    });
    return recording;
  }
}
