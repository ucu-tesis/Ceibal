import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordingsController } from './controllers/recordings.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUploadService } from './services/file-upload.service';
import { PrismaService } from './prisma.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TeachersController } from './controllers/teachers.controller';
import { EvaluationGroupsController } from './controllers/evaluationGroups.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AppController,
    RecordingsController,
    AuthController,
    TeachersController,
    EvaluationGroupsController,
  ],
  providers: [
    AppService,
    FileUploadService,
    PrismaService,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
  ],
})
export class AppModule {}
