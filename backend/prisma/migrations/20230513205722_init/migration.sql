-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "school_data" JSONB,
    "school_year" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,

    CONSTRAINT "EvaluationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reading" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationGroupReading" (
    "id" SERIAL NOT NULL,
    "reading_id" INTEGER NOT NULL,
    "evaluation_group_id" INTEGER NOT NULL,

    CONSTRAINT "EvaluationGroupReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recording" (
    "id" SERIAL NOT NULL,
    "recording_url" TEXT NOT NULL,
    "evaluation" JSONB,
    "evaluation_group_reading_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "Recording_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EvaluationGroupToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cedula_key" ON "User"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Student_cedula_key" ON "Student"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "_EvaluationGroupToStudent_AB_unique" ON "_EvaluationGroupToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_EvaluationGroupToStudent_B_index" ON "_EvaluationGroupToStudent"("B");

-- AddForeignKey
ALTER TABLE "EvaluationGroup" ADD CONSTRAINT "EvaluationGroup_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationGroupReading" ADD CONSTRAINT "EvaluationGroupReading_reading_id_fkey" FOREIGN KEY ("reading_id") REFERENCES "Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationGroupReading" ADD CONSTRAINT "EvaluationGroupReading_evaluation_group_id_fkey" FOREIGN KEY ("evaluation_group_id") REFERENCES "EvaluationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_evaluation_group_reading_id_fkey" FOREIGN KEY ("evaluation_group_reading_id") REFERENCES "EvaluationGroupReading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvaluationGroupToStudent" ADD CONSTRAINT "_EvaluationGroupToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "EvaluationGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvaluationGroupToStudent" ADD CONSTRAINT "_EvaluationGroupToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
