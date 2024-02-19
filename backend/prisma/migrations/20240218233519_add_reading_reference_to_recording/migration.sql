/*
  Warnings:

  - Added the required column `reading_id` to the `Recording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recording" ADD COLUMN     "reading_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
