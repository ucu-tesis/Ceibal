import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationGroupsController } from 'src/controllers/evaluationGroups.controller';
import { PrismaService } from 'src/prisma.service';
import { TestFactory } from '../testFactory';
import { UnprocessableEntityException } from '@nestjs/common';

const defaultPagination = { page: 0, pageSize: 20 };

describe('EvaluationGroupsController', () => {
  let controller: EvaluationGroupsController;

  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationGroupsController],
      providers: [PrismaService],
    }).compile();

    controller = app.get<EvaluationGroupsController>(
      EvaluationGroupsController,
    );
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('getAll', () => {
    describe('when no userId is passed', () => {
      it('throws an error', async () => {
        await expect(
          controller.getAll(null, defaultPagination),
        ).rejects.toThrow('Unknown arg `id` in where.Teacher.id');
      });
    });

    describe('when userId is passed', () => {
      describe('when there are no groups', () => {
        it('returns an empty array', async () => {
          const testTeacher = await TestFactory.createTeacher({});
          await expect(
            controller.getAll(testTeacher.id, defaultPagination),
          ).resolves.toEqual({ data: [] });
        });
      });

      describe('when there are groups', () => {
        it('returns the groups that match the filter, with pagination info', async () => {
          const testTeacher = await TestFactory.createTeacher({});
          const testEvaluationGroup = await TestFactory.createEvaluationGroup({
            teacherId: testTeacher.id,
          });

          expect(
            await controller.getAll(testTeacher.id, defaultPagination),
          ).toEqual({
            data: [
              {
                id: testEvaluationGroup.id,
                name: testEvaluationGroup.name,
                school_year: testEvaluationGroup.school_year,
                school_data: null,
                teacher_id: testTeacher.id,
                created_by: testTeacher.id,
              },
            ],
          });
        });
      });
    });
  });

  describe('getOne', () => {
    it('throws an error when group does not exist', async () => {
      const teacher = await TestFactory.createTeacher({ cedula: '1234' });
      await expect(controller.getOne(teacher.id, '1')).rejects.toThrow(
        new UnprocessableEntityException('Evaluation group not found'),
      );
    });

    it('returns a group with its students and assignments when it exists', async () => {
      const teacher = await TestFactory.createTeacher({ cedula: '1234' });
      const evaluationGroup = await TestFactory.createEvaluationGroup({
        teacherId: teacher.id,
      });
      const student = await TestFactory.createStudent({});
      const student2 = await TestFactory.createStudent({});
      await prismaService.student.update({
        where: { id: student.id },
        data: {
          EvaluationGroups: {
            connect: { id: evaluationGroup.id },
          },
        },
      });
      await prismaService.student.update({
        where: { id: student2.id },
        data: {
          EvaluationGroups: {
            connect: { id: evaluationGroup.id },
          },
        },
      });
      const evaluationGroupReading1 =
        await TestFactory.createEvaluationGroupReading({
          evaluationGroupId: evaluationGroup.id,
        });
      const evaluationGroupReading2 =
        await TestFactory.createEvaluationGroupReading({
          evaluationGroupId: evaluationGroup.id,
        });
      await TestFactory.createRecording({
        evaluationGroupReadingId: evaluationGroupReading1.id,
        studentId: student.id,
      });
      const associatedReading1 = await prismaService.reading.findFirstOrThrow({
        where: { id: evaluationGroupReading1.reading_id },
      });
      const associatedReading2 = await prismaService.reading.findFirstOrThrow({
        where: { id: evaluationGroupReading2.reading_id },
      });
      expect(
        await controller.getOne(teacher.id, String(evaluationGroup.id)),
      ).toEqual({
        id: evaluationGroup.id,
        name: evaluationGroup.name,
        school_data: null,
        school_year: 2023,
        teacher_id: teacher.id,
        created_by: teacher.id,
        Students: [
          {
            id: student.id,
            first_name: student.first_name,
            last_name: student.last_name,
            cedula: student.cedula,
            email: student.email,
            assignments_done: 1,
            assignments_pending: 1,
          },
          {
            id: student2.id,
            first_name: student2.first_name,
            last_name: student2.last_name,
            cedula: student2.cedula,
            email: student2.email,
            assignments_done: 0,
            assignments_pending: 2,
          },
        ],
        Assignments: [
          {
            evaluation_group_reading_id: evaluationGroupReading1.id,
            reading_id: associatedReading1.id,
            reading_title: associatedReading1.title,
            section_id: associatedReading1.section_id,
            chapter_id: expect.any(Number),
          },
          {
            evaluation_group_reading_id: evaluationGroupReading2.id,
            reading_id: associatedReading2.id,
            reading_title: associatedReading2.title,
            section_id: associatedReading2.section_id,
            chapter_id: expect.any(Number),
          },
        ],
      });
    });
  });

  describe('createAssignment', () => {
    it('creates the assignment properly when passed valid data', async () => {
      const teacher = await TestFactory.createTeacher({ cedula: '1234' });
      const evaluationGroup = await TestFactory.createEvaluationGroup({
        teacherId: teacher.id,
      });
      const reading = await TestFactory.createReading({});
      const payload = {
        reading_id: reading.id,
        due_date: new Date('2024-09-10').toISOString(),
      };
      expect(
        await controller.createAssignment(
          teacher.id,
          String(evaluationGroup.id),
          payload,
        ),
      ).toEqual({
        id: expect.any(Number),
        evaluation_group_id: evaluationGroup.id,
        reading_id: reading.id,
      });
    });

    it('throws an error if the evaluation group does not exist', async () => {
      const teacher = await TestFactory.createTeacher({ cedula: '1234' });
      const reading = await TestFactory.createReading({});
      const payload = {
        reading_id: reading.id,
        due_date: new Date('2024-09-10').toISOString(),
      };
      await expect(
        controller.createAssignment(teacher.id, '1', payload),
      ).rejects.toThrow('Evaluation group not found');
    });

    it('throws an error if the reading does not exist', async () => {
      const teacher = await TestFactory.createTeacher({ cedula: '1234' });
      const evaluationGroup = await TestFactory.createEvaluationGroup({
        teacherId: teacher.id,
      });
      const payload = {
        reading_id: 1,
        due_date: new Date('2024-09-10').toISOString(),
      };
      await expect(
        controller.createAssignment(
          teacher.id,
          String(evaluationGroup.id),
          payload,
        ),
      ).rejects.toThrow('Reading not found');
    });

    it('throws an error if the group does not belong to the teacher', async () => {
      const teacher1 = await TestFactory.createTeacher({ cedula: '1234' });
      const teacher2 = await TestFactory.createTeacher({ cedula: '5678' });
      const evaluationGroup = await TestFactory.createEvaluationGroup({
        teacherId: teacher1.id,
      });
      const reading = await TestFactory.createReading({});
      const payload = {
        reading_id: reading.id,
        due_date: new Date('2024-09-10').toISOString(),
      };
      await expect(
        controller.createAssignment(
          teacher2.id,
          String(evaluationGroup.id),
          payload,
        ),
      ).rejects.toThrow('Evaluation group not found');
    });
  });
});
