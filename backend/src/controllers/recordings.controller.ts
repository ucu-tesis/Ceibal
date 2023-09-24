import {
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import { UserService } from 'src/services/user.service';

@Controller('recordings')
export class RecordingsController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  // TODO consider moving this to a "student" controller with all other student-facing logic
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: File,
  ): Promise<{ path: string; data: any }> {
    const user = this.userService.get();
    return this.fileUploadService.uploadFileToS3(file, user.id);
  }

  @Get('/')
  @UseGuards(StudentGuard)
  async getAll(
    @Pagination() { page, pageSize }: { page: number; pageSize: number },
  ): Promise<{ data: Recording[] }> {
    const user = this.userService.get();

    const recordings = await this.prismaService.recording.findMany({
      where: {
        student_id: user.id,
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
  async getOne(@Param('recordingId') recordingId: string): Promise<Recording> {
    const user = this.userService.get();

    const recording = await this.prismaService.recording.findFirstOrThrow({
      where: {
        id: Number(recordingId),
        student_id: user.id,
      },
      include: {
        Analysis: true,
      },
    });
    return recording;
  }
}
