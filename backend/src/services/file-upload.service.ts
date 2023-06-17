import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';

@Injectable()
export class FileUploadService implements MulterOptionsFactory {
  private readonly s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    this.s3 = new S3Client({
      region: configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads/');
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    };
  }

  async uploadFileToS3(file: File): Promise<{ path: string; data: any }> {
    const bucket = this.configService.get('AWS_BUCKET');
    const filename = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: bucket,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      const path = `https://${bucket}.s3.${this.configService.get(
        'AWS_REGION',
      )}.amazonaws.com/${filename}`;

      const student = await this.prismaService.student.findFirst();
      const evaluationGroupReading =
        await this.prismaService.evaluationGroupReading.findFirst();
      await this.prismaService.recording.create({
        data: {
          recording_url: path,
          student_id: student.id,
          evaluation_group_reading_id: evaluationGroupReading.id,
        },
      });

      const formData = new FormData();
      formData.append('text', 'some text'); // TODO set proper text
      console.log('--------------------');
      console.log(file);
      console.log(file.originalname);
      console.log(filename);
      formData.append('file', new Blob([file.buffer]), file.originalname);

      // console.log(new Blob([file.buffer]).toString());

      // TODO add typing to `data`
      // TODO use env var
      const { data } = await axios.post(
        'http://audiolib:8000/process_audio',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return {
        path,
        data,
      };
    } catch (error) {
      // console.log(error);
      console.log(error?.response?.data?.detail);
      // TODO log axios error properly
      throw new BadRequestException('Error uploading file to S3');
    }
  }
}
