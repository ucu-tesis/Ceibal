-- DropForeignKey
ALTER TABLE "Recording" DROP CONSTRAINT "Recording_evaluation_group_reading_id_fkey";

-- AlterTable
ALTER TABLE "Recording" ALTER COLUMN "evaluation_group_reading_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_evaluation_group_reading_id_fkey" FOREIGN KEY ("evaluation_group_reading_id") REFERENCES "EvaluationGroupReading"("id") ON DELETE SET NULL ON UPDATE CASCADE;
