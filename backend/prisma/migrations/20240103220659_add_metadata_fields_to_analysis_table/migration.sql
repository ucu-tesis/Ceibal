-- AlterTable
ALTER TABLE "Analysis" ADD COLUMN     "processing_errors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "processing_retries" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "processing_start" TIMESTAMP(3);
