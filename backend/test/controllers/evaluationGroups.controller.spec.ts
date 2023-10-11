import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationGroupsController } from 'src/controllers/evaluationGroups.controller';
import { PrismaService } from 'src/prisma.service';
import { TestFactory } from '../testFactory';
import { UnprocessableEntityException } from '@nestjs/common';

const defaultPagination = { page: 0, pageSize: 20 };

describe('EvaluationGroupsController', () => {
  let controller: EvaluationGroupsController;

  let prismaService: PrismaService;

  beforeEach(async () => {
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
        const errorMessage = await controller
          .getAll(null, defaultPagination)
          .catch((e) => e.message);
        expect(errorMessage).toContain('Unknown arg `id` in where.Teacher.id');
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

    it('returns a group and its students when it exists', async () => {
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
      const evaluationGroupReading =
        await TestFactory.createEvaluationGroupReading({
          evaluationGroupId: evaluationGroup.id,
        });
      await TestFactory.createRecording({
        evaluationGroupReadingId: evaluationGroupReading.id,
        studentId: student.id,
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
            assignments_pending: 0,
          },
          {
            id: student2.id,
            first_name: student2.first_name,
            last_name: student2.last_name,
            cedula: student2.cedula,
            email: student2.email,
            assignments_done: 0,
            assignments_pending: 1,
          },
        ],
      });
    });
  });
});
