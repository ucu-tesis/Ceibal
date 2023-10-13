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
import { AnalysisStatus } from '@prisma/client';

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

  async uploadFileToS3(
    file: File,
    studentId: number,
  ): Promise<{ path: string; data: any }> {
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

      const evaluationGroupReading =
        await this.prismaService.evaluationGroupReading.findFirst();

      const formData = new FormData();
      formData.append('text', 'some text'); // TODO set proper text
      formData.append('file', new Blob([file.buffer]), file.originalname);

      // TODO add typing to `data`
      let data = null;
      try {
        const response = await axios.post(
          `${this.configService.get('AUDIOLIB_URL')}/process_audio`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        data = response.data;
      } catch (error) {
        console.log('Unable to process audio');
        console.error(error.message);
        console.error(error?.response?.data); // TODO log axios error properly
      }

      // TODO add created_at to recording
      const recording = await this.prismaService.recording.create({
        data: {
          recording_url: path,
          student_id: studentId,
          evaluation_group_reading_id: evaluationGroupReading.id,
        },
      });
      if (data) {
        await this.prismaService.analysis.create({
          data: {
            status: AnalysisStatus.COMPLETED,
            repetitions_count: data.cantidad_de_repeticiones,
            silences_count: data.cantidad_de_silencios,
            allosaurus_general_error: data.error_general_allosaurus,
            similarity_error: data.error_similitud,
            repeated_phonemes: data.fonemas_repetidos,
            words_with_errors: data.palabras_con_errores,
            words_with_repetitions: data.palabras_con_repeticiones,
            score: data.puntaje,
            error_timestamps: data.tiempo_errores,
            repetition_timestamps: data.tiempo_repeticiones,
            phoneme_velocity: data.velocidad_fonemas,
            words_velocity: data.velocidad_palabras,
            raw_analysis: data,
            recording_id: recording.id,
          },
        });
      }

      return {
        path,
        data,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error uploading file to S3');
    }
  }
}
