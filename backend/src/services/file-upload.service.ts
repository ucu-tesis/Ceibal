import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage, File } from 'multer';
import { PrismaService } from 'src/prisma.service';

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

  async uploadFileToS3(file: File): Promise<string> {
    const bucket = this.configService.get('AWS_BUCKET');
    const s3ObjectKey = `${Date.now()}-${file.originalname}`;
    try {
      const params = {
        Bucket: bucket,
        Key: s3ObjectKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return s3ObjectKey;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error uploading file to S3');
    }
  }

  async getSignedUrl(
    s3ObjectKey: string,
    durationInSeconds = 3600,
  ): Promise<string> {
    const bucket = this.configService.get('AWS_BUCKET');
    const getObjectParams = {
      Bucket: bucket,
      Key: s3ObjectKey,
    };

    try {
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: durationInSeconds,
      });
      return url;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error generating signed URL');
    }
  }
}
