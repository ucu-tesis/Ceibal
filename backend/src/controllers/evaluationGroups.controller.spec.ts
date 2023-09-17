import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationGroupsController } from './evaluationGroups.controller';
import { PrismaService } from 'src/prisma.service';

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
        await expect(controller.getAll(null, null)).rejects.toEqual(
          new Error('Must provide a filter'),
        );
      });
    });

    describe('when ci is passed', () => {
      const ci = '1234';

      describe('when there are no groups', () => {
        it('returns an empty array', async () => {
          await expect(controller.getAll(null, null)).resolves.toEqual([]);
        });
      });

      describe('when there are groups', () => {
        let testTeacher;
        beforeEach(async () => {
          testTeacher = await prismaService.user.create({
            data: {
              cedula: ci,
              email: 'alice@email.com',
              first_name: 'Alice',
              last_name: 'Wonders',
              GroupsOwned: {
                create: {
                  name: 'group1',
                  school_year: 2023,
                  Creator: {
                    connect: {
                      cedula: ci,
                    },
                  },
                },
              },
              password_hash: null,
            },
          });
        });

        it('returns the groups that match the filter, with pagination info', async () => {
          expect(await controller.getAll(null, null)).toEqual([
            {
              id: expect.any(Number),
              created_by: testTeacher.id,
              name: 'group1',
              school_data: null,
              school_year: 2023,
              teacher_id: testTeacher.id,
            },
          ]);
        });
      });
    });
  });

  describe('getOne', () => {
    it('returns a group and its students when it exists', async () => {
      const teacher = await prismaService.user.create({
        data: {
          cedula: '1234',
          email: 'alice@email.com',
          first_name: 'Alice',
          last_name: 'Wonders',
          password_hash: 'Password',
        },
      });
      const evaluationGroup = await prismaService.evaluationGroup.create({
        data: {
          name: 'group1',
          school_year: 2023,
          Teacher: { connect: { id: teacher.id } },
          Creator: { connect: { id: teacher.id } },
        },
      });
      const student = await prismaService.student.create({
        data: {
          cedula: '50000',
          email: 'drago@student.com',
          first_name: 'Drago',
          last_name: 'Berto',
          EvaluationGroups: {
            connect: { id: evaluationGroup.id },
          },
        },
      });
      expect(await controller.getOne(evaluationGroup.id)).toEqual({
        id: expect.any(Number),
        name: 'group1',
        school_data: null,
        school_year: 2023,
        teacher_id: teacher.id,
        created_by: teacher.id,
        Students: [
          {
            id: student.id,
            first_name: 'Drago',
            last_name: 'Berto',
            cedula: '50000',
            email: 'drago@student.com',
          },
        ],
      });
    });
  });
});
