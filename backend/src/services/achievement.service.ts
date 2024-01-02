import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AchievementService {
  constructor(private prismaService: PrismaService) {}

  async assign(studentId: number, achievementId: number) {
    return await this.prismaService.studentAchievement.create({
      data: {
        student_id: studentId,
        achievement_id: achievementId,
      },
    });
  }

  async processAchievements(studentId: number) {
    const completedReadingsCount = await this.prismaService.recording.count({
      where: {
        student_id: studentId,
      },
      distinct: ['evaluation_group_reading_id'],
    });

    if (completedReadingsCount === 1) {
      await this.assign(studentId, 1);
    } else if (completedReadingsCount === 5) {
      await this.assign(studentId, 2);
    } else if (completedReadingsCount === 10) {
      await this.assign(studentId, 3);
    } else if (completedReadingsCount === 20) {
      await this.assign(studentId, 4);
    }
  }
}
