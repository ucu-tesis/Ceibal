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
    const completedReadingsCount = await this.prismaService.recording.count({
      where: {
        student_id: studentId,
      },
      distinct: ['evaluation_group_reading_id'],
    });

    if (completedReadingsCount === 1) {
      await this.assign(studentId, 'completed:1');
    } else if (completedReadingsCount === 5) {
      await this.assign(studentId, 'completed:5');
    } else if (completedReadingsCount === 10) {
      await this.assign(studentId, 'completed:10');
    } else if (completedReadingsCount === 20) {
      await this.assign(studentId, 'completed:20');
    }
  }
}
