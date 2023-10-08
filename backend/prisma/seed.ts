import { AnalysisStatus, PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

async function load() {
  const admin = await prisma.user.upsert({
    where: { cedula: '99999' },
    update: {},
    create: {
      cedula: '99999',
      email: 'admin@admin.com',
      first_name: 'Admin',
      last_name: 'Admin',
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
  });
  const testTeacher = await prisma.user.upsert({
    where: { cedula: '10000' },
    update: {},
    create: {
      cedula: '10000',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Wonders',
      GroupsOwned: {
        create: {
          name: 'group1',
          school_year: 2023,
          created_by: admin.id,
        },
      },
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
    include: { GroupsOwned: true },
  });

  await addSSOUsers(testTeacher);

  await prisma.student.upsert({
    where: { cedula: '50000' },
    update: {},
    create: {
      cedula: '50000',
      email: 'drago@student.com',
      first_name: 'Drago',
      last_name: 'Berto',
      EvaluationGroups: {
        connect: { id: testTeacher.GroupsOwned[0].id },
      },
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
    include: { EvaluationGroups: true },
  });

  const testReading1 = await prisma.reading.create({
    data: {
      title: 'Quiero ser Súarez',
      imageUrl: 'https://picsum.photos/300/400',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  });

  const testReading2 = await prisma.reading.create({
    data: {
      title: 'Diógenes no quiere ser ratón',
      imageUrl: 'https://picsum.photos/300/400',
      content:
        'Elementum curabitur vitae nunc sed velit. Vel turpis nunc eget lorem dolor. Nisl purus in mollis nunc sed id semper risus in. Blandit aliquam etiam erat velit scelerisque in. Laoreet id donec ultrices tincidunt arcu non sodales neque. Fermentum dui faucibus in ornare quam viverra orci. Velit laoreet id donec ultrices tincidunt arcu. Adipiscing bibendum est ultricies integer. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Imperdiet nulla malesuada pellentesque elit eget gravida cum. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Viverra mauris in aliquam sem fringilla ut morbi. Convallis tellus id interdum velit laoreet id donec. Dui faucibus in ornare quam viverra orci. In eu mi bibendum neque.',
    },
  });

  const testReading3 = await prisma.reading.create({
    data: {
      title: 'Física Teórica. Mecánica Quántica: 1',
      imageUrl: 'https://picsum.photos/300/400',
      content:
        'Dictum varius duis at consectetur lorem. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Quisque id diam vel quam elementum. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Iaculis at erat pellentesque adipiscing commodo elit. Felis donec et odio pellentesque diam volutpat. Vitae semper quis lectus nulla at volutpat diam. Eget est lorem ipsum dolor. Risus sed vulputate odio ut enim blandit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta. Neque gravida in fermentum et. Odio eu feugiat pretium nibh ipsum. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Massa sed elementum tempus egestas sed sed risus pretium quam. Faucibus purus in massa tempor nec feugiat. Dapibus ultrices in iaculis nunc sed. Nulla facilisi cras fermentum odio eu feugiat.',
    },
  });

  const groupReading1 = await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading1.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
    },
  });

  const groupReading2 = await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading2.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
    },
  });

  const groupReading3 = await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading3.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
    },
  });

  await addStudentReading(1, groupReading1.id);
  await addStudentReading(1, groupReading2.id);
  await addStudentReading(1, groupReading3.id);
}

async function addSSOUsers(testTeacher) {
  // Students
  await prisma.student.upsert({
    where: { cedula: '88888880' },
    update: {},
    create: {
      cedula: '88888880',
      email: 'ucu.tesis.ceibal@gmail.com',
      first_name: 'Cosme',
      last_name: 'Fulanito',
      EvaluationGroups: {
        connect: { id: testTeacher.GroupsOwned[0].id },
      },
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
    include: { EvaluationGroups: true },
  });

  // Teachers
  await prisma.user.upsert({
    where: { cedula: '99999990' },
    update: {},
    create: {
      cedula: '99999990',
      email: 'paolo.a.mazza@gmail.com',
      first_name: 'Paolo',
      last_name: 'Mazza',
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
  });
  await prisma.user.upsert({
    where: { cedula: '99999991' },
    update: {},
    create: {
      cedula: '99999991',
      email: 'gcabrera243@gmail.com',
      first_name: 'Gastón',
      last_name: 'Cabrera',
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
  });
  await prisma.user.upsert({
    where: { cedula: '99999992' },
    update: {},
    create: {
      cedula: '99999992',
      email: 'farchiten@gmail.com',
      first_name: 'Alexis',
      last_name: 'Dotta',
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
  });
  await prisma.user.upsert({
    where: { cedula: '99999993' },
    update: {},
    create: {
      cedula: '99999993',
      email: 'marcos.de.oliveira.madeira@gmail.com',
      first_name: 'Marcos',
      last_name: 'De Olivera',
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
  });
  await prisma.user.upsert({
    where: { cedula: '99999994' },
    update: {},
    create: {
      cedula: '99999994',
      email: 'vextil@gmail.com',
      first_name: 'Joaquín',
      last_name: 'Cuitiño',
      password_hash:
        '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
    },
  });
}

async function addStudentReading(studentId, groupReadingId) {
  const recording = await prisma.recording.create({
    data: {
      recording_url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      evaluation: {},
      evaluation_group_reading_id: groupReadingId,
      student_id: studentId,
    },
  });

  await prisma.analysis.create({
    data: {
      recording_id: recording.id,
      status: AnalysisStatus.COMPLETED,
      repetitions_count: randomInt(0, 4),
      silences_count: randomInt(0, 4),
      allosaurus_general_error: 0,
      similarity_error: 0,
      repeated_phonemes: [],
      words_with_errors: [],
      words_with_repetitions: [],
      score: randomInt(50, 100),
      error_timestamps: [],
      repetition_timestamps: [],
      phoneme_velocity: randomInt(10, 40),
      words_velocity: randomInt(10, 40),
      raw_analysis: {},
    },
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
