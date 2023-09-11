import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

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

  static async createReading({ ...attributes }) {
    return prisma.reading.create({
      data: {
        title: faker.word.noun(),
        content: faker.lorem.lines(2),
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

  // TODO create helpers for generating a teacher with groups, students in the groups, and readings
}
