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
        await expect(controller.getAll(null, null, null)).rejects.toEqual(
          new Error('Must provide a filter'),
        );
      });
    });

    describe('when ci is passed', () => {
      const ci = '1234';

      describe('when there are no groups', () => {
        it('returns an empty array', async () => {
          await expect(controller.getAll(null, null, ci)).resolves.toEqual([]);
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
          expect(await controller.getAll(null, null, ci)).toEqual([
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
});
