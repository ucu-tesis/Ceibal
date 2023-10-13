import { AnalysisStatus, PrismaClient } from '@prisma/client';

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

  const testStudent = await prisma.student.upsert({
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

  const testGroup = await prisma.evaluationGroupReading.upsert({
    where: { id: 1 }, // TODO evaulationGroupReadingParams, (after adding unique constraint)
    update: {},
    create: evaulationGroupReadingParams,
  });

  await prisma.recording.upsert({
    where: { id: 1 },
    update: {},
    create: {
      recording_url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      evaluation_group_reading_id: testGroup.id,
      student_id: testStudent.id,
    },
  });

  const analysisRawData = {
    cantidad_de_repeticiones: 0,
    cantidad_de_silencios: 0,
    cantidad_palabras_con_error: 4,
    error_general_allosaurus: 44,
    error_similitud: 215,
    fonemas_repetidos: [],
    palabras_con_errores: ['some', 'text', 'some', 'text'],
    palabras_con_repeticiones: [],
    puntaje: 0,
    tiempo_errores: [1.38, 2.08, 1.38, 2.08],
    tiempo_repeticiones: [],
    velocidad_fonemas: 198,
    velocidad_palabras: 57,
  };

  await prisma.analysis.upsert({
    where: { id: 1 },
    update: {},
    create: {
      recording_id: 1,
      status: AnalysisStatus.COMPLETED,
      repetitions_count: analysisRawData.cantidad_de_repeticiones,
      silences_count: analysisRawData.cantidad_de_silencios,
      allosaurus_general_error: analysisRawData.error_general_allosaurus,
      similarity_error: analysisRawData.error_similitud,
      repeated_phonemes: analysisRawData.fonemas_repetidos,
      words_with_errors: analysisRawData.palabras_con_errores,
      words_with_repetitions: analysisRawData.palabras_con_repeticiones,
      score: analysisRawData.puntaje,
      error_timestamps: analysisRawData.tiempo_errores,
      repetition_timestamps: analysisRawData.tiempo_repeticiones,
      phoneme_velocity: analysisRawData.velocidad_fonemas,
      words_velocity: analysisRawData.velocidad_palabras,
      raw_analysis: analysisRawData,
    },
  });
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
