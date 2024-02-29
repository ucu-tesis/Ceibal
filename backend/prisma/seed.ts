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
      title: 'Quiero ser Suárez',
      image_url: 'https://picsum.photos/300/400',
      content: `Había una vez un niño llamado Martín que soñaba con convertirse en un gran goleador como su héroe, Luis Suárez.

        Martín vivía en un pequeño pueblo donde cada tarde, después de la escuela, corría al campo de fútbol con su viejo balón desgastado. Martín admiraba a Suárez no solo por sus increíbles goles, sino también por su valentía y espíritu de equipo.

        Decidió que algún día, él también sería un delantero formidable, igual que su ídolo.`,
      category: 'Básico',
      subcategory: 'Fútbol',
    },
  });

  const testReading2 = await prisma.reading.create({
    data: {
      title: 'Diógenes no quiere ser ratón',
      image_url: 'https://picsum.photos/300/400',
      content: `¡Pobre Diógenes! Fue un error mirarse en el espejo luego de haber comido cinco páginas de un antiguo libro de animales...

      Cuando vio su imagen reflejada, descubrió que ya no quería ser ratón. «No me gusta ser como soy, quiero ser otro. ¡Es tan difícil ser uno mismo!», pensó mientras desaprobaba sus orejas gigantescas, sus ojos saltones y sus dientes desparejos.

        «¡Seré un jabalí!», exclamó de pronto Diógenes.

        Y al instante, como por milagro, se transformó en un extraño jabalí.`,
      category: 'Básico',
      subcategory: 'Animales',
    },
  });

  const testReading3 = await prisma.reading.create({
    data: {
      title: 'La Aventura de Pico Amarillo',
      image_url: 'https://picsum.photos/300/400',
      content: `En el vasto cielo azul, donde el sol brilla con fuerza y las nubes se deslizan perezosamente, vive un pequeño pájaro llamado Pico Amarillo.Con sus alas fuertes y su plumaje brillante, Pico Amarillo es conocido por ser el más aventurero de todos los pájaros del bosque.

      Un día, decide emprender el viaje más emocionante de su vida: encontrar el legendario Árbol de las Cerezas Doradas.Según los cuentos de los mayores, este árbol mágico solo da frutos una vez cada cien años, y sus cerezas doradas pueden conceder deseos.

      Con el corazón lleno de esperanza y los ojos brillando de emoción, Pico Amarillo inicia su viaje, con el coraje y la importancia de creer en uno mismo.`,
      category: 'Básico',
      subcategory: 'Animales',
    },
  });

  const testReading4 = await prisma.reading.create({
    data: {
      title: 'La Carrera del Río',
      image_url: 'https://picsum.photos/300/400',
      content: `Entre los competidores estaban Lina la Liebre, con sus patas largas y rápidas; Tortu, la tortuga sabia y serena; y un nuevo desafiante este año, Felipe el Pez, quien aseguraba que podía ganar la carrera desde el agua.

      A medida que la carrera comenzaba, los animales del bosque se alineaban a lo largo de las orillas para animar a sus favoritos.Lina saltaba con agilidad, mientras que Tortu avanzaba lento pero seguro, y Felipe nadaba ágilmente siguiendo el curso del río.A lo largo del camino, cada uno enfrentó desafíos que pusieron a prueba su determinación.`,
      category: 'Básico',
      subcategory: 'Animales',
    },
  });

  const testReading5 = await prisma.reading.create({
    data: {
      title: 'Princesofía',
      image_url: 'https://picsum.photos/300/400',
      content: `En un reino lleno de magia y color, vivía una princesa muy especial llamada Sofía.Sofía amaba aprender y soñaba con aventuras que le enseñaran sobre el mundo más allá de los muros del castillo.

        Cada día, se levantaba con el sol y en lugar de asistir a clases de etiqueta, prefería estudiar mapas, leer sobre plantas y animales exóticos, y practicar arquería. "Una princesa debe ser valiente, curiosa y bondadosa", decía siempre.`,
      category: 'Básico',
      subcategory: 'Cuentos de hadas',
    },
  });

  const testReading6 = await prisma.reading.create({
    data: {
      title: 'El Jardín Encantado',
      image_url: 'https://picsum.photos/300/400',
      content: `En el corazón de un reino lejano, más allá de los montes y los ríos, hay un jardín secreto, oculto por un hechizo anitguo.Solo aquellos de corazón puro podían ver el resplandor de sus flores mágicas, que brillaban bajo la luz de las estrellas.

      Era un lugar de encuentro para las criaturas más maravillosas y bondadosas del reino, desde hadas diminutas hasta unicornios de mirada sabia.

      Una noche, un joven aventurero, guiado por la curiosidad y la promesa de descubrir lo desconocido, encontró la entrada al jardín.Lo que vio allí, iluminado por la suave luz de la luna, cambiaría su destino para siempre.`,
      category: 'Básico',
      subcategory: 'Cuentos de hadas',
    },
  });

  const testReading7 = await prisma.reading.create({
    data: {
      title: 'El Misterio de la Isla Escondida',
      image_url: 'https://picsum.photos/300/400',
      content: `El sol se ponía en el horizonte cuando Lucas y Emma, con el mapa desplegado entre ellos, decidieron que era el momento de emprender su aventura.La Isla Escondida, según las leyendas, albergaba un tesoro sin igual, pero lo que realmente buscaban era la emoción de descubrir lo desconocido.

      "¿Crees que encontraremos el tesoro?" preguntó Emma, mirando el mapa con esperanza.

      "Lo que importa es la aventura," respondió Lucas, ajustándose la mochila. "Pero sí, creo que encontraremos algo increíble."

      Con el primer rayo de luna, zarparon en su pequeña embarcación, guiados por las estrellas y la antigua brújula que siempre apuntaba hacia la aventura.La noche era tranquila, pero el mar es impredecible, y pronto se encontraron navegando entre olas que contaban sus propias historias de marineros y tesoros perdidos.`,
      category: 'Intermedio',
      subcategory: 'Aventuras',
    },
  });

  const testReading8 = await prisma.reading.create({
    data: {
      title: 'El Bosque de los Secretos Susurrantes',
      image_url: 'https://picsum.photos/300/400',
      content: `Sofía y Alex siempre habían sentido curiosidad por el viejo bosque que se extendía más allá de su pueblo.Se decía que era un lugar donde la naturaleza hablaba, donde cada planta y cada criatura tenía su historia.Armados con una libreta y una cámara, decidieron adentrarse en este misterioso mundo para documentar sus maravillas.

      A medida que avanzaban, el bosque parecía cobrar vida.Los árboles susurraban con el viento, llevando mensajes antiguos que solo el corazón podía entender.Se encontraron con rastros de animales que nunca habían visto, huellas que los llevaban por senderos ocultos hacia claros iluminados por rayos de sol donde florecían flores de colores imposibles.

      "¿Oíste eso?" preguntó Sofía, deteniéndose en seco.Un suave canto se elevaba cerca de ellos, una melodía que parecía invitarlos a seguir adelante.Siguiendo el sonido, descubrieron una pequeña cascada, cuyas aguas danzaban bajo la luz del sol, creando arcoíris efímeros.`,
      category: 'Intermedio',
      subcategory: 'Aventuras',
    },
  });

  const testReading9 = await prisma.reading.create({
    data: {
      title: 'El Canto de la Selva',
      image_url: 'https://picsum.photos/300/400',
      content: `La luz del sol se filtraba a través de las densas copas de los árboles, creando un mosaico de luces y sombras en el suelo del bosque.A su alrededor, el zumbido de los insectos se mezclaba con el canto de las aves, creando una sinfonía natural que Elena nunca había experimentado.Se detuvo a observar cómo una mariposa posaba delicadamente sobre una flor, maravillándose de la precisión con la que la naturaleza tejía sus conexiones.

      Mientras avanzaba, Elena tomó notas sobre las diferentes especies de plantas que encontraba, fascinada por la diversidad de la vida en la selva.Se sorprendió al descubrir cómo algunas plantas habían desarrollado relaciones simbióticas con los animales, proporcionándoles alimento a cambio de la dispersión de sus semillas.`,
      category: 'Intermedio',
      subcategory: 'Naturaleza',
    },
  });

  const testReading10 = await prisma.reading.create({
    data: {
      title: 'Desiertos de Arena y Estrellas',
      image_url: 'https://picsum.photos/300/400',
      content: `Armada con una botella de agua, un sombrero de ala ancha y su fiel cuaderno, comenzó su caminata.No pasó mucho tiempo antes de que observara los primeros signos de vida.Un lagarto escarabajo se deslizaba rápidamente entre las sombras, buscando refugio del calor abrasador.Lara tomó nota de cómo sus patas estaban adaptadas para correr sobre la arena sin hundirse.

      Más adelante, se maravilló ante la resistencia de las plantas del desierto, como el cactus, que almacenaba agua en sus gruesos tallos para sobrevivir meses sin lluvia.La adaptación, pensó Lara, era la clave de la supervivencia aquí, donde cada gota de agua y cada sombra era un tesoro.

      Al final del día, con el sol poniéndose y pintando el cielo de tonos naranjas y rosas, Lara se sentó en la cima de una duna.Había aprendido que incluso en los lugares más inhóspitos, la vida encuentra una manera de florecer.El desierto, con sus extremas condiciones, era un testimonio de la resiliencia y adaptabilidad de la naturaleza.`,
      category: 'Intermedio',
      subcategory: 'Naturaleza',
    },
  });

  const testReading11 = await prisma.reading.create({
    data: {
      title: 'Descifrando los Secretos del Universo Oscuro',
      image_url: 'https://picsum.photos/300/400',
      content: `En el corazón de la cosmología moderna yace un enigma que desafía nuestras comprensiones más fundamentales del universo: la naturaleza del universo oscuro.Compuesto por materia oscura y energía oscura, constituye aproximadamente el 95 % del total del cosmos, dejando a la materia ordinaria, aquella con la que estamos familiarizados, en una minoría sorprendentemente pequeña.

      La materia oscura, invisible y detectable únicamente a través de sus efectos gravitacionales sobre la materia visible, teje la infraestructura cósmica, dictando la formación y estructura de galaxias.Por otro lado, la energía oscura, aún más misteriosa, impulsa la expansión acelerada del universo, un descubrimiento que ha sacudido los cimientos de la física teórica.

      Exploraremos los últimos avances en nuestra búsqueda para desentrañar estos misterios, desde experimentos subterráneos hasta observaciones astronómicas de vanguardia, y cómo estos esfuerzos podrían no solo revelar la verdadera naturaleza del universo oscuro sino también transformar nuestra comprensión de la física misma.`,
      category: 'Avanzado',
      subcategory: 'Ciencias',
    },
  });

  const testReading12 = await prisma.reading.create({
    data: {
      title: 'La Revolución de la Genética',
      image_url: 'https://picsum.photos/300/400',
      content: `La biotecnología ha entrado en una nueva era dorada con el desarrollo de CRISPR, una herramienta de edición genética que ha transformado radicalmente las posibilidades de la ingeniería genética.

      Este sistema, derivado de mecanismos de defensa bacterianos, permite a los científicos realizar cortes precisos en el ADN, eliminando, añadiendo o alterando secuencias genéticas con una precisión sin precedentes.Este avance representa no solo un salto monumental en la investigación genética, sino también una promesa para el tratamiento de enfermedades hasta ahora incurables, desde trastornos hereditarios como la distrofia muscular y la fibrosis quística hasta el cáncer y enfermedades cardiovasculares. `,
      category: 'Avanzado',
      subcategory: 'Ciencias',
    },
  });

  const testReading13 = await prisma.reading.create({
    data: {
      title: 'El Surgimiento del Imperio Otomano',
      image_url: 'https://picsum.photos/300/400',
      content: `A finales del siglo XIII, en las estepas de Anatolia, emergía un poder destinado a transformar radicalmente el equilibrio político y cultural del mundo medieval: el Imperio Otomano.Fundado por Osman I, este imperio no solo unificó bajo su estandarte a tribus turcas nómadas, sino que también inició una era de expansión militar y florecimiento cultural que desafiaría a las más grandes potencias de su tiempo.

      El siglo XV marcó el cenit de su expansión con la conquista de Constantinopla en 1453 bajo el mando de Mehmed II, conocido como "el Conquistador".Esta victoria no solo significó el fin del milenario Imperio Romano de Oriente, sino que también estableció a los otomanos como una fuerza dominante en el Mediterráneo, abriendo nuevas rutas comerciales y culturales entre Oriente y Occidente.`,
      category: 'Avanzado',
      subcategory: 'Historia',
    },
  });

  const testReading14 = await prisma.reading.create({
    data: {
      title: 'La Revolución Industrial',
      image_url: 'https://picsum.photos/300/400',
      content: `La invención de la máquina de vapor por James Watt y la introducción del telar mecánico revolucionaron la industria textil, la esfera productiva dominante de la época.Estas innovaciones propiciaron un incremento exponencial en la producción y eficiencia, pero también trajeron consigo desafíos significativos.La concentración de fábricas en ciudades provocó una migración masiva del campo a la urbe, generando crecimiento urbano desmedido y condiciones de vida precarias para la clase trabajadora.

      El impacto de la Revolución Industrial se extendió más allá de la economía y la demografía; provocó un replanteamiento de las leyes laborales, la educación y el papel del Estado en la protección del bienestar de sus ciudadanos.Las respuestas a estos desafíos sentaron las bases para las políticas sociales modernas y el desarrollo de sindicatos que buscarían mejorar las condiciones laborales.`,
      category: 'Avanzado',
      subcategory: 'Historia',
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

  const octoberDate = new Date('2023-10-5');
  const novemberDate = new Date('2023-11-18');
  const decemberDate = new Date('2023-12-22');

  await addStudentReading(
    1,
    groupReading1.id,
    groupReading1.reading_id,
    octoberDate,
  );
  await addStudentReading(
    1,
    groupReading2.id,
    groupReading2.reading_id,
    octoberDate,
  );
  await addStudentReading(
    1,
    groupReading3.id,
    groupReading3.reading_id,
    novemberDate,
  );
  await addStudentReading(
    1,
    groupReading1.id,
    groupReading1.reading_id,
    novemberDate,
  );
  await addStudentReading(
    1,
    groupReading1.id,
    groupReading1.reading_id,
    decemberDate,
  );
  await addStudentReading(
    1,
    groupReading1.id,
    groupReading1.reading_id,
    decemberDate,
  );

  await addStudentReading(
    2,
    groupReading1.id,
    groupReading1.reading_id,
    octoberDate,
  );
  await addStudentReading(
    2,
    groupReading2.id,
    groupReading2.reading_id,
    octoberDate,
  );
  await addStudentReading(
    2,
    groupReading3.id,
    groupReading3.reading_id,
    novemberDate,
  );
  await addStudentReading(
    2,
    groupReading1.id,
    groupReading1.reading_id,
    novemberDate,
  );
  await addStudentReading(
    2,
    groupReading1.id,
    groupReading1.reading_id,
    decemberDate,
  );
  await addStudentReading(
    2,
    groupReading1.id,
    groupReading1.reading_id,
    decemberDate,
  );

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

  await addStudents(testTeacher);
  await addAchievements();
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

async function addStudentReading(
  studentId,
  groupReadingId,
  readingId,
  createdAt = undefined,
) {
  const recording = await prisma.recording.create({
    data: {
      recording_url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      evaluation_group_reading_id: groupReadingId,
      reading_id: readingId,
      student_id: studentId,
      created_at: createdAt,
    },
  });

  const analysisRawData = {
    cantidad_de_repeticiones: randomInt(0, 4),
    cantidad_de_silencios: randomInt(0, 4),
    cantidad_palabras_con_error: randomInt(0, 10),
    error_general_allosaurus: 44,
    error_similitud: 15,
    fonemas_repetidos: [],
    palabras_con_errores: ['some', 'text', 'some', 'text'],
    palabras_con_repeticiones: ['sample', 'word', 'text', 'sample'],
    puntaje: randomInt(50, 100),
    tiempo_errores: [1.38, 2.08, 1.38, 2.08],
    tiempo_repeticiones: [],
    velocidad_fonemas: randomInt(50, 200),
    velocidad_palabras: randomInt(50, 200),
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
      created_at: createdAt,
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

async function addAchievements() {
  const achievements = [
    {
      id: 1,
      trigger_id: 'completed:1',
      name: 'Lector Principiante',
      description: 'Has completado tu primer lectura',
      image_url: '/achievements/1.jpg',
    },
    {
      id: 2,
      trigger_id: 'completed:5',
      name: 'Lector Intermedio',
      description: 'Has completado 5 lecturas',
      image_url: '/achievements/2.jpg',
    },
    {
      id: 3,
      trigger_id: 'completed:10',
      name: 'Lector Avanzado',
      description: 'Has completado 10 lecturas',
      image_url: '/achievements/3.jpg',
    },
    {
      id: 4,
      trigger_id: 'completed:20',
      name: 'Lector Experto',
      description: 'Has completado 20 lecturas',
      image_url: '/achievements/4.jpg',
    },
  ];
  await prisma.achievement.createMany({
    data: achievements,
  });

  const userAchievements = [
    {
      student_id: 1,
      achievement_id: 1,
    },
    {
      student_id: 1,
      achievement_id: 2,
    },
  ];

  await prisma.studentAchievement.createMany({
    data: userAchievements,
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
