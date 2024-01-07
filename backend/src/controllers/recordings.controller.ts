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
import { AnalysisStatus, Recording } from '@prisma/client';
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
  @Post('/upload/:evaluationGroupReadingId')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(StudentGuard)
  async upload(
    @UserData('id') userId: number,
    @Param('evaluationGroupReadingId') evaluationGroupReadingId: string,
    @UploadedFile() file: File,
  ): Promise<{ recordingId: number; analysisId: number }> {
    const s3ObjectKey = await this.fileUploadService.uploadFileToS3(file);

    const recording = await this.prismaService.recording.create({
      data: {
        recording_url: s3ObjectKey,
        student_id: userId,
        // TODO check student is part of evaluation group
        evaluation_group_reading_id: Number(evaluationGroupReadingId),
        Analysis: {
          create: {
            status: AnalysisStatus.PENDING,
          },
        },
      },
      include: {
        Analysis: true,
      },
    });

    return { recordingId: recording.id, analysisId: recording.Analysis[0].id };
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
        EvaluationGroupReading: {
          include: {
            Reading: true,
          },
        },
      },
    });
    return recording;
  }
}
