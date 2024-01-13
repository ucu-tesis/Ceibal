/*
  Warnings:

  - A unique constraint covering the columns `[trigger_id]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trigger_id` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "trigger_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_trigger_id_key" ON "Achievement"("trigger_id");
