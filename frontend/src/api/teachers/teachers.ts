import {
  Assignment,
  AssignmentStatus,
  StudentAssignment,
} from '@/models/Assignment';
import { AssignmentReading } from '@/models/AssignmentReading';
import { Group } from '@/models/Group';
import { GroupDetails } from '@/models/GroupDetails';
import { Reading } from '@/models/Reading';
import {
  AssignmentStats,
  GroupStats,
  MonthlyAverage,
  MonthItem as StatsMonthItem,
  StudentStats,
} from '@/models/Stats';
import { Student } from '@/models/Student';
import { StudentAssignmentDetails } from '@/models/StudentAssignmentDetails';
import axiosInstance from '../axiosInstance';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface CreateReadingResponse {
  id: number;
  title: string;
  content: string;
  image_url: string; // TODO @Vextil this type could potentially change when adding file support
  category: string;
  subcategory: string;
  position: number;
  is_public: boolean;
  created_at: Date;
  created_by: number;
}

interface CreateReadingRequest {
  category: string;
  content: string;
  file: File;
  subcategory: string;
  title: string;
}

export interface CategoriesAndSubcategoriesResponse {
  categories: string[];
  subcategories: string[];
}

interface StudentMonthlyAverage {
  month: number;
  student_avg_score: number;
  group_avg_score: number;
}

interface StudentStatsAssignment {
  due_date: string;
  id: number;
  reading_category: string;
  reading_id: number;
  reading_subcategory?: string;
  reading_title: string;
  score: number;
  status: AssignmentStatus;
}

interface StudentStatsResponse {
  Assignments: StudentStatsAssignment[];
  average_score: number;
  assignments_delayed: number;
  assignments_done: number;
  assignments_pending: number;
  monthly_averages: StudentMonthlyAverage[];
  average_errors: {
    repetitions_count: number;
    silences_count: number;
    general_errors: number;
  };
  student_name: string;
  student_id: number;
  group_name: string;
  group_id: number;
}

interface GroupsResponse {
  data: GroupResponse[];
}

interface GroupResponse {
  created_by: number;
  id: number;
  name: string;
  school_data?: string; // TODO: Define type
  school_year: number;
  teacher_id: number;
}

interface GroupDetailsResponse extends GroupResponse {
  Assignments?: AssignmentResponse[];
  Students?: StudentResponse[];
}

interface AssignmentResponse {
  evaluation_group_reading_id: number;
  reading_category: string;
  reading_id: number;
  reading_title: string;
  reading_subcategory?: string;
  due_date: string;
}

interface StudentResponse {
  assignments_done?: number;
  assignments_pending?: number;
  cedula: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface RepeatedWords {
  word: string;
  repetition_count: number;
}

interface AssignmentStatsResponse {
  assignment: {
    id: string;
    due_date: string;
    created_at: string;
    reading: {
      id: string;
      title: string;
      category: string;
      subcategory: string;
    };
  };
  assignments_done: number;
  assignments_pending: number;
  isOpen: boolean;
  average_score: number;
  recordings: AssignmentReading[];
  average_errors: {
    repetitions_count: number;
    silences_count: number;
    general_errors: number;
  };
  most_repeated_words: RepeatedWords[];
  group_id: number;
  group_name: string;
}

interface GroupStatsResponse {
  assignments_done: number;
  assignments_pending: number;
  assignments_delayed: number;
  monthly_score_averages: StatsMonthItem[];
  monthly_assignments_done: StatsMonthItem[];
  monthly_assignments_pending: StatsMonthItem[];
  monthly_assignments_delayed: StatsMonthItem[];
}

interface ReadingsResponse {
  Readings: Reading[];
  page: number;
  page_size: number;
  total: number;
}

interface StudentAssignmentDetailsResponse {
  analysis_id: number | null;
  student_id: number;
  student_name: string;
  evaluation_group_reading_id: number;
  reading_id: number;
  reading_title: string;
  category: string;
  subcategory: string;
  group_id: number;
  group_name: string;
  score: number | null;
  words_velocity: number | null;
  silences_count: number | null;
  repetitions_count: number | null;
  recording_id: number | null;
  recording_url: string | null;
  status: string;
}

export const fetchGroupDetails = (groupId: number) =>
  axiosInstance
    .get<GroupDetailsResponse>(`/evaluationGroups/${groupId}`)
    .then(({ data }) => parseGroupDetailsResponse(data));

export const fetchGroups = (teacherCI: number) =>
  axiosInstance
    .get<GroupsResponse>('/evaluationGroups', {
      params: { ci: teacherCI }, // TODO: Modify when backend changes the CI param.
    })
    .then(({ data }) => parseGroupsResponse(data));

export const fetchStudentStats = (
  groupId: number,
  studentId: number,
  dateFrom: string,
  dateTo: string,
) =>
  axiosInstance
    .get<StudentStatsResponse>(
      `/evaluationGroups/${groupId}/students/${studentId}`,
      { params: { dateFrom, dateTo } },
    )
    .then(({ data }) => parseStudentStatsResponse(data));

export const fetchGroupStats = (
  groupId: number,
  dateFrom: string,
  dateTo: string,
) =>
  axiosInstance
    .get<GroupStatsResponse>(`/evaluationGroups/${groupId}/stats`, {
      params: { dateFrom, dateTo },
    })
    .then(({ data }) => parseGroupStatsResponse(data));

export const fetchAssignmentStats = (
  evaluationGroupId: number,
  evaluationGroupReadingId: number,
) =>
  axiosInstance
    .get<AssignmentStatsResponse>(
      `evaluationGroups/${evaluationGroupId}/assignments/${evaluationGroupReadingId}`,
    )
    .then(({ data }) => parseAssignmentStatsResponse(data));

export const fetchAllReadings = () =>
  axiosInstance.get<ReadingsResponse>('/readings').then(({ data }) => data);

export const createAssignment = (
  evaluationGroupId: number,
  readings: Reading[],
  dueDate: string,
) => {
  return axiosInstance.post(
    `/evaluationGroups/${evaluationGroupId}/assignments`,
    {
      reading_ids: readings.map((reading) => reading.id),
      due_date: dueDate,
    },
  );
};

export const fetchStudentAssignmentDetails = (
  assignmentId: number,
  studentId: number,
) =>
  axiosInstance
    .get<StudentAssignmentDetailsResponse>(
      `/evaluationGroups/assignments/${assignmentId}/${studentId}`,
    )
    .then(({ data }) => parseStudentAssignmentDetailsResponse(data));

export const fetchCategoriesAndSubcategories = () =>
  axiosInstance
    .get<CategoriesAndSubcategoriesResponse>('/readings/categories')
    .then(({ data }) => data);

export const createReading = async (request: CreateReadingRequest) => {
  const formData = new FormData();
  formData.append('category', request.category);
  formData.append('subcategory', request.subcategory);
  formData.append('content', request.content);
  formData.append('title', request.title);
  formData.append('file', request.file);

  const { data } = await axiosInstance.post<CreateReadingResponse>(
    '/readings',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
};

// Parse methods

const parseGroupsResponse = (res: GroupsResponse): Group[] =>
  res.data.map(parseGroupResponse);

const parseGroupResponse = (group: GroupResponse): Group => ({
  createdBy: group.created_by,
  schoolYear: group.school_year,
  teacherId: group.teacher_id,
  schoolData: group.school_data,
  id: group.id,
  name: group.name,
});

const parseGroupDetailsResponse = (
  res: GroupDetailsResponse,
): GroupDetails => ({
  createdBy: res.created_by,
  id: res.id,
  name: res.name,
  schoolYear: res.school_year,
  schoolData: res.school_data,
  teacherId: res.teacher_id,
  assignments: res.Assignments?.map(parseAssignmentResponse) ?? [],
  students: res.Students?.map(parseStudentResponse) ?? [],
});

const parseAssignmentResponse = (
  assignment: AssignmentResponse,
): Assignment => ({
  dueDate: new Date(assignment.due_date),
  evaluationGroupReadingId: assignment.evaluation_group_reading_id,
  readingCategory: assignment.reading_category,
  readingId: assignment.reading_id,
  readingSubcategory: assignment.reading_subcategory ?? '',
  readingTitle: assignment.reading_title,
});

const parseStudentResponse = (student: StudentResponse): Student => ({
  assignmentsDone: student.assignments_done,
  assignmentsPending: student.assignments_pending,
  firstName: student.first_name,
  fullName: `${student.first_name} ${student.last_name}`,
  lastName: student.last_name,
  cedula: student.cedula,
  email: student.email,
  id: student.id,
});

const parseStudentAssignment = (
  assignment: StudentStatsAssignment,
): StudentAssignment => ({
  dueDate: new Date(assignment.due_date),
  evaluationGroupReadingId: assignment.id,
  readingCategory: assignment.reading_category,
  readingId: assignment.reading_id,
  readingSubcategory: assignment.reading_subcategory ?? '', // TODO Make this nullable in Assignment.ts model
  readingTitle: assignment.reading_title,
  score: assignment.score,
  status: assignment.status,
});

const parseMonthlyAverage = (
  monthlyAverage: StudentMonthlyAverage,
): MonthlyAverage => ({
  groupAverageScore: monthlyAverage.group_avg_score,
  month: monthlyAverage.month,
  studentAverageScore: monthlyAverage.student_avg_score,
});

const parseStudentStatsResponse = (
  stats: StudentStatsResponse,
): StudentStats => ({
  assignments: stats.Assignments.map(parseStudentAssignment),
  assignmentsDone: stats.assignments_done,
  assignmentsPending: stats.assignments_pending,
  assignmentsUncompleted: stats.assignments_delayed,
  averageScore: stats.average_score,
  monthlyAverages: stats.monthly_averages.map(parseMonthlyAverage),
  averageErrors: {
    generalErrors: stats.average_errors.general_errors,
    repetitionsCount: stats.average_errors.repetitions_count,
    silencesCount: stats.average_errors.silences_count,
  },
  studentName: stats.student_name,
  studentId: stats.student_id,
  groupName: stats.group_name,
  groupId: stats.group_id,
});

const parseGroupStatsResponse = (stats: GroupStatsResponse): GroupStats => ({
  assignmentsDone: stats.assignments_done,
  assignmentsDelayed: stats.assignments_delayed,
  assignmentsPending: stats.assignments_pending,
  monthlyScoreAverages: stats.monthly_score_averages,
  monthlyAssignmentsDone: stats.monthly_assignments_done,
  monthlyAssignmentsDelayed: stats.monthly_assignments_delayed,
  monthlyAssignmentsPending: stats.monthly_assignments_pending,
});

const parseAssignmentStatsResponse = (
  stats: AssignmentStatsResponse,
): AssignmentStats => {
  const {
    assignment: { due_date, created_at, reading, id },
    assignments_done,
    assignments_pending,
    isOpen,
    recordings,
    average_errors: { general_errors, repetitions_count, silences_count },
    average_score,
    most_repeated_words,
  } = stats;
  return {
    assignment: {
      dueDate: new Date(due_date),
      evaluationGroupReadingId: parseInt(id),
      createdDate: new Date(created_at),
      readingCategory: reading.category,
      readingId: parseInt(reading.id),
      readingSubcategory: reading.subcategory,
      readingTitle: reading.title,
    },
    assignmentsDone: assignments_done,
    assignmentsPending: assignments_pending,
    isOpen,
    recordings: recordings,
    averageErrors: {
      generalErrors: general_errors,
      repetitionsCount: repetitions_count,
      silencesCount: silences_count,
    },
    averageScore: average_score,
    mostRepeatedWords: most_repeated_words.map(
      ({ repetition_count, word }) => ({
        repetitionCount: repetition_count,
        word,
      }),
    ),
    groupId: stats.group_id,
    groupName: stats.group_name,
  };
};

const parseStudentAssignmentDetailsResponse = (
  recording: StudentAssignmentDetailsResponse,
): StudentAssignmentDetails => ({
  analysisId: recording.analysis_id,
  studentId: recording.student_id,
  studentName: recording.student_name,
  evaluationGroupReadingId: recording.evaluation_group_reading_id,
  readingId: recording.reading_id,
  readingTitle: recording.reading_title,
  category: recording.category,
  subcategory: recording.subcategory,
  groupId: recording.group_id,
  groupName: recording.group_name,
  score: recording.score,
  wordsVelocity: recording.words_velocity,
  silencesCount: recording.silences_count,
  repetitionsCount: recording.repetitions_count,
  recordingId: recording.recording_id,
  recordingUrl: recording.recording_url,
  status: recording.status,
});
