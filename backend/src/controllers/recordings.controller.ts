import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/services/file-upload.service';
import { File } from 'multer';

@Controller('recordings')
export class RecordingsController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: File,
  ): Promise<{ path: string; data: any }> {
    return this.fileUploadService.uploadFileToS3(file);
  }
}
