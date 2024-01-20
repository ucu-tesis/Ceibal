import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prismaService: PrismaService) {}

  async assign(studentId: number, triggerId: string) {
    const achievement = await this.prismaService.achievement.findFirst({
      where: {
        trigger_id: triggerId,
      },
    });
    if (!achievement) {
      return;
    }
    return await this.prismaService.studentAchievement.create({
      data: {
        student_id: studentId,
        achievement_id: achievement.id,
      },
    });
  }

  async processReadingAmountAchievements(studentId: number) {
    const completedReadings = (await this.prismaService.$queryRaw`
      SELECT COUNT(DISTINCT evaluation_group_reading_id) as count
      FROM "Recording" 
      WHERE student_id = ${studentId}
    `) as { count: number }[];

    const count = Number(completedReadings[0].count);

    if (count === 1) {
      await this.assign(studentId, 'completed:1');
    } else if (count === 5) {
      await this.assign(studentId, 'completed:5');
    } else if (count === 10) {
      await this.assign(studentId, 'completed:10');
    } else if (count === 20) {
      await this.assign(studentId, 'completed:20');
    }
  }
}
