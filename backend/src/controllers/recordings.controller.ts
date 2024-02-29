import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UnprocessableEntityException,
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
import { AchievementService } from 'src/services/achievement.service';
import { IsOptional, IsString } from 'class-validator';

class UploadRecordingDTO {
  @IsString()
  @IsOptional()
  evaluationGroupReadingId: string;
  @IsString()
  readingId: string;
}

@Controller('recordings')
export class RecordingsController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private prismaService: PrismaService,
    private achievementService: AchievementService,
  ) {}

  // TODO consider moving this to a "student" controller with all other student-facing logic
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(StudentGuard)
  async upload(
    @UserData('id') userId: number,
    @Body() uploadDTO: UploadRecordingDTO,
    @UploadedFile() file: File,
  ): Promise<{ recordingId: number; analysisId: number }> {
    const readingId = parseInt(uploadDTO.readingId);
    const evaluationGroupReadingId = parseInt(
      uploadDTO.evaluationGroupReadingId,
    );
    const s3File = await this.fileUploadService.uploadFileToPrivateS3(file);

    const reading = await this.prismaService.reading.findUnique({
      where: {
        id: readingId,
      },
    });

    if (!reading) {
      throw new UnprocessableEntityException('Reading not found');
    }

    if (uploadDTO.evaluationGroupReadingId) {
      const evaluationGroupReading =
        await this.prismaService.evaluationGroupReading.findFirst({
          where: {
            id: evaluationGroupReadingId,
            reading_id: readingId,
            EvaluationGroup: {
              Students: {
                some: {
                  id: userId,
                },
              },
            },
          },
        });
      if (!evaluationGroupReading) {
        throw new ForbiddenException(
          'You are not part of this evaluation group reading',
        );
      }
    }

    const recording = await this.prismaService.recording.create({
      data: {
        recording_url: s3File.key,
        student_id: userId,
        evaluation_group_reading_id: evaluationGroupReadingId || null,
        reading_id: readingId,
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

    await this.achievementService.processReadingAmountAchievements(userId);

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
        Reading: true,
        EvaluationGroupReading: true,
      },
    });

    recording.Reading.image_url = this.fileUploadService.getPublicUrl(
      recording.Reading.image_url,
    );

    return {
      ...recording,
      recording_url: await this.fileUploadService.getSignedUrl(
        recording.recording_url,
      ),
    };
  }
}
