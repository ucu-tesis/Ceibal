import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function load() {
  const admin = await prisma.user.upsert({
    where: { cedula: '99999' },
    update: {},
    create: {
      cedula: '99999',
      first_name: 'Admin',
      last_name: 'Admin',
    },
  });
  const testTeacher = await prisma.user.upsert({
    where: { cedula: '10000' },
    update: {},
    create: {
      cedula: '10000',
      first_name: 'Alice',
      last_name: 'Wonders',
      GroupsOwned: {
        create: {
          name: 'group1',
          school_year: 2023,
          created_by: admin.id,
        },
      },
    },
    include: { GroupsOwned: true },
  });

  const testStudent = await prisma.student.upsert({
    where: { cedula: '50000' },
    update: {},
    create: {
      cedula: '50000',
      first_name: 'Drago',
      last_name: 'Berto',
      EvaluationGroups: {
        connect: { id: testTeacher.GroupsOwned[0].id },
      },
    },
    include: { EvaluationGroups: true },
  });

  const testReading = await prisma.reading.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Test reading',
      content:
        'Blablabla some long text, Blablabla some long text. Blablabla some long text.',
    },
  });

  const evaulationGroupReadingParams = {
    reading_id: testReading.id,
    evaluation_group_id: testStudent.EvaluationGroups[0].id,
  };

  await prisma.evaluationGroupReading.upsert({
    where: { id: 1 }, // TODO evaulationGroupReadingParams, (after adding unique constraint)
    update: {},
    create: evaulationGroupReadingParams,
  });
}
const main = async () => {
  try {
    await load();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
main();