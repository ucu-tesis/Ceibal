-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'WORKING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Analysis" (
    "id" SERIAL NOT NULL,
    "recording_id" INTEGER NOT NULL,
    "status" "AnalysisStatus" NOT NULL,
    "repetitions_count" INTEGER NOT NULL,
    "silences_count" INTEGER NOT NULL,
    "allosaurus_general_error" INTEGER NOT NULL,
    "similarity_error" INTEGER NOT NULL,
    "repeated_phonemes" TEXT[],
    "words_with_errors" TEXT[],
    "words_with_repetitions" TEXT[],
    "score" DOUBLE PRECISION NOT NULL,
    "error_timestamps" DOUBLE PRECISION[],
    "repetition_timestamps" DOUBLE PRECISION[],
    "phoneme_velocity" DOUBLE PRECISION NOT NULL,
    "words_velocity" DOUBLE PRECISION NOT NULL,
    "raw_analysis" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_recording_id_fkey" FOREIGN KEY ("recording_id") REFERENCES "Recording"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
