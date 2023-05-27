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
  const alice = await prisma.user.upsert({
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
  console.log({ alice });
  console.log(alice.GroupsOwned[0]);

  const testStudent = await prisma.student.upsert({
    where: { cedula: '50000' },
    update: {},
    create: {
      cedula: '50000',
      first_name: 'Drago',
      last_name: 'Berto',
      EvaluationGroups: {
        connect: { id: alice.GroupsOwned[0].id },
      },
    },
    include: { EvaluationGroups: true },
  });
  console.log({ testStudent });
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
