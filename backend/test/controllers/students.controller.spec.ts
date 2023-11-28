import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from 'src/controllers/students.controller';
import { PrismaService } from 'src/prisma.service';
import { TestFactory } from '../testFactory';

describe('RecordingsController', () => {
  let controller: StudentsController;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [PrismaService],
    }).compile();

    controller = app.get<StudentsController>(StudentsController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('getReadingDetails', () => {
    it('returns a recording and its analyses when it exists', async () => {
      const student = await TestFactory.createStudent({});
      const evaluationGroup = await TestFactory.createEvaluationGroup({});
      await prismaService.student.update({
        where: { id: student.id },
        data: { EvaluationGroups: { connect: { id: evaluationGroup.id } } },
      });
      const reading = await TestFactory.createReading();
      const evaluationGroupReading =
        await TestFactory.createEvaluationGroupReading({
          readingId: reading.id,
          evaluationGroupId: evaluationGroup.id,
        });
      expect(
        await controller.getReadingDetails(
          student.id,
          String(evaluationGroupReading.reading_id),
        ),
      ).toEqual({
        evaluation_group_reading_id: evaluationGroupReading.id,
        reading_id: reading.id,
        reading_title: reading.title,
        reading_content: reading.content,
        reading_category: reading.category,
        reading_subcategory: reading.subcategory,
      });
    });
  });

  describe('getCategorizedReadings', () => {
    it('returns all available readings, grouped by category then by subcategory', async () => {
      const student = await TestFactory.createStudent({});
      const evaluationGroup = await TestFactory.createEvaluationGroup({});
      await prismaService.student.update({
        where: { id: student.id },
        data: { EvaluationGroups: { connect: { id: evaluationGroup.id } } },
      });

      const reading1 = await TestFactory.createReading({
        category: 'category1',
        subcategory: 'subcategory1',
      });
      const reading2 = await TestFactory.createReading({
        category: 'category1',
        subcategory: 'subcategory1',
      });
      const reading3 = await TestFactory.createReading({
        category: 'category1',
        subcategory: 'subcategory2',
      });
      const reading4 = await TestFactory.createReading({
        category: 'category2',
        subcategory: 'subcategory1',
      });
      const readingWithNoSubcategory = await TestFactory.createReading({
        category: 'category2',
        subcategory: null,
      });
      const privateAssignedReading = await TestFactory.createReading({
        category: 'category2',
        subcategory: 'subcategory1',
        is_public: false,
      });
      await TestFactory.createEvaluationGroupReading({
        readingId: privateAssignedReading.id,
        evaluationGroupId: evaluationGroup.id,
      });
      // This reading should not be visible because its not public nor assigned
      await TestFactory.createReading({
        category: 'category2',
        subcategory: 'subcategory1',
        is_public: false,
      });

      expect(await controller.getCategorizedReadings(student.id)).toEqual([
        {
          category: 'category1',
          subcategories: [
            {
              subcategory: 'subcategory1',
              readings: [
                {
                  reading_id: reading1.id,
                  title: reading1.title,
                },
                { reading_id: reading2.id, title: reading2.title },
              ],
            },
            {
              subcategory: 'subcategory2',
              readings: [{ reading_id: reading3.id, title: reading3.title }],
            },
          ],
        },
        {
          category: 'category2',
          subcategories: [
            {
              subcategory: 'subcategory1',
              readings: [
                { reading_id: reading4.id, title: reading4.title },
                {
                  reading_id: privateAssignedReading.id,
                  title: privateAssignedReading.title,
                },
              ],
            },
            {
              subcategory: null,
              readings: [
                {
                  reading_id: readingWithNoSubcategory.id,
                  title: readingWithNoSubcategory.title,
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
