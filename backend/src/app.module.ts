import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecordingsController } from './controllers/recordings.controller';
import { ConfigModule } from '@nestjs/config';
import { FileUploadService } from './services/file-upload.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, RecordingsController],
  providers: [AppService, FileUploadService],
})
export class AppModule {}
