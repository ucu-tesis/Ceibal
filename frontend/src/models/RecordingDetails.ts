export interface StudentAssignmentDetails {
    analysisId: number | null;
    studentId: number;
    studentFirstName: string;
    studentLastName: string;
    evaluationGroupReadingId: number;
    readingId: number;
    readingTitle: string;
    category: string;
    subcategory: string;
    groupId: number;
    groupName: string;
    score: number | null;
    wordsVelocity: number | null;
    silencesCount: number | null;
    repetitionsCount: number | null;
    recordingId: number | null;
    recordingUrl: string | null;
    status: string;
}