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

@Injectable()
export class FileUploadService implements MulterOptionsFactory {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
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

  async uploadFileToPrivateS3(file: File): Promise<{
    key: string;
    url: string;
  }> {
    const bucket = this.configService.get('AWS_BUCKET');
    return this.uploadFileToS3(bucket, file);
  }

  async uploadFileToPublicS3(file: File): Promise<{
    key: string;
    url: string;
  }> {
    const bucket = this.configService.get('AWS_PUBLIC_BUCKET');
    return this.uploadFileToS3(bucket, file);
  }

  private async uploadFileToS3(
    bucket: string,
    file: File,
  ): Promise<{
    key: string;
    url: string;
  }> {
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
      // return the URL
      return {
        key: s3ObjectKey,
        url: `https://${bucket}.s3.amazonaws.com/${s3ObjectKey}`,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error uploading file to public S3');
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

    // If the key is an URL, that means it's already a signed URL
    // or it's not an S3 upload, skip signing and return the URL.
    if (
      s3ObjectKey.startsWith('http://') ||
      s3ObjectKey.startsWith('https://')
    ) {
      return s3ObjectKey;
    }

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

  getPublicUrl(s3ObjectKey: string): string {
    // If the key is an URL, that means it's already a public URL
    // or it's not an S3 upload, skip and return the URL.
    if (
      s3ObjectKey.startsWith('http://') ||
      s3ObjectKey.startsWith('https://')
    ) {
      return s3ObjectKey;
    }

    const bucket = this.configService.get('AWS_PUBLIC_BUCKET');
    return `https://${bucket}.s3.amazonaws.com/${s3ObjectKey}`.replace(
      /([^:])(\/\/+)/g,
      '$1/',
    );
  }
}
