-- AlterTable
ALTER TABLE "Analysis" ALTER COLUMN "repetitions_count" DROP NOT NULL,
ALTER COLUMN "silences_count" DROP NOT NULL,
ALTER COLUMN "allosaurus_general_error" DROP NOT NULL,
ALTER COLUMN "similarity_error" DROP NOT NULL,
ALTER COLUMN "repeated_phonemes" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "words_with_errors" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "words_with_repetitions" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "error_timestamps" SET DEFAULT ARRAY[]::DOUBLE PRECISION[],
ALTER COLUMN "repetition_timestamps" SET DEFAULT ARRAY[]::DOUBLE PRECISION[],
ALTER COLUMN "phoneme_velocity" DROP NOT NULL,
ALTER COLUMN "words_velocity" DROP NOT NULL,
ALTER COLUMN "raw_analysis" DROP NOT NULL;
