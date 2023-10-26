/*
  Warnings:

  - You are about to drop the column `index_in_chapter` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the column `section_id` on the `Reading` table. All the data in the column will be lost.
  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reading" DROP CONSTRAINT "Reading_section_id_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_chapter_id_fkey";

-- AlterTable
ALTER TABLE "Reading" DROP COLUMN "section_id",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Intermedio',
ADD COLUMN     "subcategory" TEXT;

ALTER TABLE "Reading" RENAME "index_in_chapter" TO "position";

-- DropTable
DROP TABLE "Chapter";

-- DropTable
DROP TABLE "Section";
