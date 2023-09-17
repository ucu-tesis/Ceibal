import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationGroupsController } from 'src/controllers/evaluationGroups.controller';
import { PrismaService } from 'src/prisma.service';
import { TestFactory } from '../testFactory';

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
    describe('when no ci is passed', () => {
      it('throws an error', async () => {
        await expect(
          controller.getAll(defaultPagination, null),
        ).rejects.toEqual(new Error('Must provide a filter'));
      });
    });

    describe('when ci is passed', () => {
      const ci = '1234';

      describe('when there are no groups', () => {
        it('returns an empty array', async () => {
          await expect(
            controller.getAll(defaultPagination, ci),
          ).resolves.toEqual({ data: [] });
        });
      });

      describe('when there are groups', () => {
        it('returns the groups that match the filter, with pagination info', async () => {
          const testTeacher = await TestFactory.createTeacher({ cedula: ci });
          const testEvaluationGroup = await TestFactory.createEvaluationGroup({
            teacherId: testTeacher.id,
          });

          expect(await controller.getAll(defaultPagination, ci)).toEqual({
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
    it('returns a group and its students when it exists', async () => {
      const teacher = await TestFactory.createTeacher({ cedula: '1234' });
      const evaluationGroup = await TestFactory.createEvaluationGroup({
        teacherId: teacher.id,
      });
      const student = await TestFactory.createStudent({});
      await prismaService.student.update({
        where: { id: student.id },
        data: {
          EvaluationGroups: {
            connect: { id: evaluationGroup.id },
          },
        },
      });
      expect(await controller.getOne(String(evaluationGroup.id))).toEqual({
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
          },
        ],
      });
    });
  });
});
