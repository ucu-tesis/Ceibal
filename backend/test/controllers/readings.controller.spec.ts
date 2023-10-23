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
      const teacher1 = await TestFactory.createTeacher({});
      const teacher2 = await TestFactory.createTeacher({});
      await TestFactory.createReading({
        title: 'reading1',
        created_by: teacher1.id,
        is_public: true,
      });
      await TestFactory.createReading({
        title: 'reading2',
        created_by: teacher1.id,
        is_public: false,
      });
      await TestFactory.createReading({
        title: 'reading3',
        created_by: teacher2.id,
        is_public: false,
      });
      const result = await controller.getAll(teacher2.id, {
        page: 0,
        pageSize: 5,
      });
      expect(result).toEqual({
        Readings: [
          expect.objectContaining({
            title: 'reading1',
            is_public: true,
          }),
          expect.objectContaining({
            title: 'reading3',
            is_public: false,
          }),
        ],
        page: 0,
        page_size: 5,
        total: 2,
      });
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
        category: 'Beginner',
        subcategory: 'Adventure',
      });
      const readingsAfter = await prismaService.reading.findMany();
      expect(readingsAfter).toEqual([
        {
          id: result.id,
          title: 'testTitle',
          content: 'someContent',
          category: 'Beginner',
          subcategory: 'Adventure',
          position: 0,
          image_url: null,
          is_public: false,
          created_at: expect.any(Date),
          created_by: teacher.id,
        },
      ]);
    });
  });
});
