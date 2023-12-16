import { fakerES as faker } from '@faker-js/faker';
import { AnalysisStatus, PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

async function load() {
  const testTeacher = await prisma.user.upsert({
    where: { cedula: '10000' },
    update: {},
    create: {
      cedula: '10000',
      email: 'alice@email.com',
      first_name: 'Alice',
      last_name: 'Wonders',
      GroupsOwned: {
        create: [
          {
            name: '1ero A',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '1ero B',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '1ero C',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '2do A',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '2do B',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '2do C',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '3ero A',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '3ero B',
            school_year: 2023,
            created_by: 1,
          },
          {
            name: '3ero C',
            school_year: 2023,
            created_by: 1,
          },
        ],
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
      image_url: 'https://picsum.photos/300/400',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: 'Básico',
      subcategory: 'Fútbol',
    },
  });

  const testReading2 = await prisma.reading.create({
    data: {
      title: 'Diógenes no quiere ser ratón',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Elementum curabitur vitae nunc sed velit. Vel turpis nunc eget lorem dolor. Nisl purus in mollis nunc sed id semper risus in. Blandit aliquam etiam erat velit scelerisque in. Laoreet id donec ultrices tincidunt arcu non sodales neque. Fermentum dui faucibus in ornare quam viverra orci. Velit laoreet id donec ultrices tincidunt arcu. Adipiscing bibendum est ultricies integer. Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Imperdiet nulla malesuada pellentesque elit eget gravida cum. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Viverra mauris in aliquam sem fringilla ut morbi. Convallis tellus id interdum velit laoreet id donec. Dui faucibus in ornare quam viverra orci. In eu mi bibendum neque.',
      category: 'Básico',
      subcategory: 'Fútbol',
    },
  });

  const testReading3 = await prisma.reading.create({
    data: {
      title: 'Física Teórica. Mecánica Quántica: 1',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Dictum varius duis at consectetur lorem. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Quisque id diam vel quam elementum. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Iaculis at erat pellentesque adipiscing commodo elit. Felis donec et odio pellentesque diam volutpat. Vitae semper quis lectus nulla at volutpat diam. Eget est lorem ipsum dolor. Risus sed vulputate odio ut enim blandit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta. Neque gravida in fermentum et. Odio eu feugiat pretium nibh ipsum. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Massa sed elementum tempus egestas sed sed risus pretium quam. Faucibus purus in massa tempor nec feugiat. Dapibus ultrices in iaculis nunc sed. Nulla facilisi cras fermentum odio eu feugiat.',
      category: 'Avanzado',
      subcategory: 'Ciencias',
    },
  });

  const testReading4 = await prisma.reading.create({
    data: {
      title: 'The Art of War - Sun Tzu',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Quisque id diam vel quam elementum. Mi eget mauris pharetra et ultrices neque ornare aenean euismod. Iaculis at erat pellentesque adipiscing commodo elit. Felis donec et odio pellentesque diam volutpat. Vitae semper quis lectus nulla at volutpat diam. Eget est lorem ipsum dolor. Risus sed vulputate odio ut enim blandit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta. Neque gravida in fermentum et. Odio eu feugiat pretium nibh ipsum. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Massa sed elementum tempus egestas sed sed risus pretium quam. Faucibus purus in massa tempor nec feugiat. Dapibus ultrices in iaculis nunc sed. Nulla facilisi cras fermentum odio eu feugiat.',
      category: 'Intermedio',
      subcategory: 'Guerra',
    },
  });

  const testReading5 = await prisma.reading.create({
    data: {
      title: '100 Páginas en blanco: Edición Limitada',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Felis donec et odio pellentesque diam volutpat. Vitae semper quis lectus nulla at volutpat diam. Eget est lorem ipsum dolor. Risus sed vulputate odio ut enim blandit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta. Neque gravida in fermentum et. Odio eu feugiat pretium nibh ipsum. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Massa sed elementum tempus egestas sed sed risus pretium quam. Faucibus purus in massa tempor nec feugiat. Dapibus ultrices in iaculis nunc sed. Nulla facilisi cras fermentum odio eu feugiat.',
      category: 'Intermedio',
      subcategory: 'Guerra',
    },
  });

  const testReading6 = await prisma.reading.create({
    data: {
      title: '200 Páginas en blanco: Edición Limitada',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Felis donec et odio pellentesque diam volutpat. Vitae semper quis lectus nulla at volutpat diam. Eget est lorem ipsum dolor. Risus sed vulputate odio ut enim blandit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta. Neque gravida in fermentum et. Odio eu feugiat pretium nibh ipsum. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Massa sed elementum tempus egestas sed sed risus pretium quam. Faucibus purus in massa tempor nec feugiat. Dapibus ultrices in iaculis nunc sed. Nulla facilisi cras fermentum odio eu feugiat.',
      category: 'Intermedio',
      subcategory: 'Guerra',
    },
  });

  const testReading7 = await prisma.reading.create({
    data: {
      title: '999 Páginas en blanco: Edición Limitada',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Felis donec et odio pellentesque diam volutpat. Vitae semper quis lectus nulla at volutpat diam. Eget est lorem ipsum dolor. Risus sed vulputate odio ut enim blandit. Arcu vitae elementum curabitur vitae nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta. Neque gravida in fermentum et. Odio eu feugiat pretium nibh ipsum. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Massa sed elementum tempus egestas sed sed risus pretium quam. Faucibus purus in massa tempor nec feugiat. Dapibus ultrices in iaculis nunc sed. Nulla facilisi cras fermentum odio eu feugiat.',
      category: 'Avanzado',
      subcategory: 'Guerra',
    },
  });

  const testReading8 = await prisma.reading.create({
    data: {
      title: 'Princesofía',
      image_url: 'https://picsum.photos/300/400',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: 'Básico',
      subcategory: 'Princesas',
    },
  });

  const groupReading1 = await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading1.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
      due_date: new Date('2024-08-10'),
    },
  });

  const groupReading2 = await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading2.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
      due_date: new Date('2024-10-10'),
    },
  });

  const groupReading3 = await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading3.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
      due_date: new Date('2024-09-10'),
    },
  });

  await addStudentReading(1, groupReading1.id);
  await addStudentReading(1, groupReading2.id);
  await addStudentReading(1, groupReading3.id);

  await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading4.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
      due_date: new Date('2024-09-10'),
    },
  });

  await prisma.evaluationGroupReading.create({
    data: {
      reading_id: testReading5.id,
      evaluation_group_id: testTeacher.GroupsOwned[0].id,
      due_date: new Date('2024-09-10'),
    },
  });

  addStudents(testTeacher);
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
      evaluation_group_reading_id: groupReadingId,
      student_id: studentId,
    },
  });

  const analysisRawData = {
    cantidad_de_repeticiones: randomInt(0, 4),
    cantidad_de_silencios: randomInt(0, 4),
    cantidad_palabras_con_error: 4,
    error_general_allosaurus: 44,
    error_similitud: 15,
    fonemas_repetidos: [],
    palabras_con_errores: ['some', 'text', 'some', 'text'],
    palabras_con_repeticiones: [],
    puntaje: randomInt(50, 100),
    tiempo_errores: [1.38, 2.08, 1.38, 2.08],
    tiempo_repeticiones: [],
    velocidad_fonemas: 198,
    velocidad_palabras: 57,
  };

  await prisma.analysis.create({
    data: {
      recording_id: recording.id,
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

async function addStudents(teacher) {
  for (let i = 0; i < 30; i++) {
    const ci = randomInt(5000000, 6000000).toString();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
    });
    await prisma.student.upsert({
      where: { cedula: ci },
      update: {},
      create: {
        cedula: ci,
        email: email,
        first_name: firstName,
        last_name: lastName,
        EvaluationGroups: {
          connect: { id: teacher.GroupsOwned[0].id },
        },
        password_hash:
          '$2y$10$Rc2tFlQEKnsY5j4U5RowkOtetNyFOZPq/rVWDAkAR8pGC4S.SFIMC', // password
      },
      include: { EvaluationGroups: true },
    });
  }
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
