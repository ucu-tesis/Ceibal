-- AlterTable
ALTER TABLE "Reading" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
