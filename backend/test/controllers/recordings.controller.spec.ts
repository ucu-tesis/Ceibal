import { Test, TestingModule } from '@nestjs/testing';
import { RecordingsController } from 'src/controllers/recordings.controller';
import { PrismaService } from 'src/prisma.service';
import { TestFactory } from '../testFactory';
import { FileUploadService } from 'src/services/file-upload.service';
import { ConfigService } from '@nestjs/config';

const defaultPagination = { page: 0, pageSize: 20 };

describe('RecordingsController', () => {
  let controller: RecordingsController;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecordingsController],
      providers: [ConfigService, FileUploadService, PrismaService],
    }).compile();

    controller = app.get<RecordingsController>(RecordingsController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    it('throws an error when studentId is not passed', async () => {
      const errorMessage = await controller
        .getAll(null, defaultPagination)
        .catch((e) => e.message);
      expect(errorMessage).toContain(
        'Argument student_id for where.student_id must not be null',
      );
    });

    describe('when there are no recordings', () => {
      it('returns an empty array', async () => {
        const student = await TestFactory.createStudent({});
        await expect(
          controller.getAll(student.id, defaultPagination),
        ).resolves.toEqual({ data: [] });
      });
    });

    describe('when there are some recordings', () => {
      it('returns the recordings that match the filter, with pagination info', async () => {
        const recording1 = await TestFactory.createRecording({});
        await TestFactory.createRecording({}); // should not be found since its for another student

        const studentId = recording1.student_id;

        expect(await controller.getAll(studentId, defaultPagination)).toEqual({
          data: [
            {
              id: recording1.id,
              evaluation_group_reading_id:
                recording1.evaluation_group_reading_id,
              student_id: recording1.student_id,
              recording_url: recording1.recording_url,
              created_at: expect.any(Date),
            },
          ],
        });
      });
    });
  });

  describe('getOne', () => {
    it('returns a recording and its analyses when it exists', async () => {
      const recording = await TestFactory.createRecording({});
      const analysis = await TestFactory.createAnalysis({
        recordingId: recording.id,
      });
      await TestFactory.createAnalysis({}); // should not be found since its for another recording
      expect(
        await controller.getOne(recording.student_id, String(recording.id)),
      ).toEqual({
        id: recording.id,
        evaluation_group_reading_id: recording.evaluation_group_reading_id,
        student_id: recording.student_id,
        recording_url: recording.recording_url,
        Analysis: [analysis],
        created_at: expect.any(Date),
      });
    });
  });
});
