import { faker } from '@faker-js/faker';
import { AnalysisStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fakeCedula = () =>
  String(faker.number.int({ min: 1_000_000, max: 9_999_999 }));

export class TestFactory {
  static async createStudent({ cedula, ...attributes }: { cedula?: string }) {
    return prisma.student.create({
      data: {
        cedula: cedula || fakeCedula(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password_hash: 'password',
        ...attributes,
      },
    });
  }

  static async createTeacher({ cedula, ...attributes }: { cedula?: string }) {
    return prisma.user.create({
      data: {
        cedula: cedula || fakeCedula(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password_hash: 'password',
        ...attributes,
      },
    });
  }

  static async createEvaluationGroup({
    teacherId,
    ...attributes
  }: {
    teacherId?: number;
  }) {
    if (!teacherId) {
      teacherId = (await TestFactory.createTeacher({})).id;
    }
    return prisma.evaluationGroup.create({
      data: {
        name: faker.word.noun(),
        school_year: 2023,
        teacher_id: teacherId,
        created_by: teacherId,
        ...attributes,
      },
    });
  }

  static async createChapter({ ...attributes }) {
    return prisma.chapter.create({
      data: {
        title: faker.word.noun(),
        description: faker.lorem.lines(2),
        difficulty: 1,
        ...attributes,
      },
    });
  }

  static async createSection({
    chapterId,
    ...attributes
  }: { chapterId?: number } = {}) {
    if (!chapterId) {
      chapterId = (await this.createChapter({})).id;
    }
    return prisma.section.create({
      data: {
        title: faker.word.noun(),
        description: faker.lorem.lines(2),
        chapter_id: chapterId,
        index_in_chapter: 0,
        ...attributes,
      },
    });
  }

  static async createReading({
    sectionId,
    ...attributes
  }: { sectionId?: number } = {}) {
    if (!sectionId) {
      sectionId = (await this.createSection({})).id;
    }
    return prisma.reading.create({
      data: {
        title: faker.word.noun(),
        content: faker.lorem.lines(2),
        section_id: sectionId,
        ...attributes,
      },
    });
  }

  static async createEvaluationGroupReading({
    readingId,
    evaluationGroupId,
  }: {
    readingId?: number;
    evaluationGroupId?: number;
  } = {}) {
    if (!readingId) {
      readingId = (await this.createReading({})).id;
    }
    if (!evaluationGroupId) {
      evaluationGroupId = (await this.createEvaluationGroup({})).id;
    }
    return prisma.evaluationGroupReading.create({
      data: {
        reading_id: readingId,
        evaluation_group_id: evaluationGroupId,
      },
    });
  }

  static async createRecording({
    evaluationGroupReadingId,
    studentId,
    ...attributes
  }: {
    evaluationGroupReadingId?: number;
    studentId?: number;
  }) {
    if (!evaluationGroupReadingId) {
      evaluationGroupReadingId = (
        await TestFactory.createEvaluationGroupReading()
      ).id;
    }
    if (!studentId) {
      // TODO ensure student belongs to evaluation group for the created evaluationGroupReading
      studentId = (await TestFactory.createStudent({})).id;
    }
    return prisma.recording.create({
      data: {
        student_id: studentId,
        evaluation_group_reading_id: evaluationGroupReadingId,
        recording_url: faker.internet.url(),
        ...attributes,
      },
    });
  }

  static async createAnalysis({
    recordingId,
    ...attributes
  }: {
    recordingId?: number;
  }) {
    if (!recordingId) {
      recordingId = (await TestFactory.createRecording({})).id;
    }
    return prisma.analysis.create({
      data: {
        recording_id: recordingId,
        status: AnalysisStatus.COMPLETED,
        repetitions_count: 0,
        silences_count: 0,
        allosaurus_general_error: 0,
        similarity_error: 0,
        repeated_phonemes: [],
        words_with_errors: [],
        words_with_repetitions: [],
        score: faker.number.int(100),
        error_timestamps: [],
        repetition_timestamps: [],
        phoneme_velocity: 0,
        words_velocity: 0,
        raw_analysis: {},
        ...attributes,
      },
    });
  }

  // TODO create helpers for generating a teacher with groups, students in the groups, and readings
}
