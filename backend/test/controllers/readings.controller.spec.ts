import { Test, TestingModule } from '@nestjs/testing';
import { ReadingsController } from 'src/controllers/readings.controller';
import { PrismaService } from 'src/prisma.service';
import { TestFactory } from '../testFactory';

describe('ReadingsController', () => {
  let controller: ReadingsController;

  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReadingsController],
      providers: [PrismaService],
    }).compile();

    controller = app.get<ReadingsController>(ReadingsController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    it('returns all readings with pagination', async () => {
      const teacher = await TestFactory.createTeacher({});
      const createdReadings = [];
      for (let i = 0; i < 8; i++) {
        createdReadings.push(await TestFactory.createReading({}));
      }
      const result = await controller.getAll(teacher.id, {
        page: 0,
        pageSize: 5,
      });
      expect(result).toEqual({
        Readings: createdReadings.slice(0, 5),
        page: 0,
        page_size: 5,
        total: 8,
      });
    });

    it('includes private readings that are created by the given user', async () => {
      // TODO
    });
  });

  describe('createReading', () => {
    it('creates with valid params', async () => {
      const teacher = await TestFactory.createTeacher({});
      const readingsBefore = await prismaService.reading.findMany();
      expect(readingsBefore).toEqual([]);
      const result = await controller.createReading(teacher.id, {
        title: 'testTitle',
        content: 'someContent',
      });
      const readingsAfter = await prismaService.reading.findMany();
      expect(readingsAfter).toEqual([
        {
          id: result.id,
          title: 'testTitle',
          content: 'someContent',
          image_url: null,
          index_in_chapter: 0,
          section_id: null,
        },
      ]);
    });
  });
});
