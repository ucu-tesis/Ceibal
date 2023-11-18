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
});
