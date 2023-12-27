import {
  Assignment,
  AssignmentStatus,
  StudentAssignment,
} from "@/models/Assignment";
import { Group } from "@/models/Group";
import { GroupDetails } from "@/models/GroupDetails";
import { MonthlyAverage, StudentStats } from "@/models/Stats";
import { Student } from "@/models/Student";
import axiosInstance from "../axiosInstance";

interface StudentMonthlyAverage {
  month: string;
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

export const fetchGroupDetails = (groupId: number) =>
  axiosInstance
    .get<GroupDetailsResponse>(`/evaluationGroups/${groupId}`)
    .then(({ data }) => parseGroupDetailsResponse(data));

export const fetchGroups = (teacherCI: number) =>
  axiosInstance
    .get<GroupsResponse>("/evaluationGroups", {
      params: { ci: teacherCI }, // TODO: Modify when backend changes the CI param.
    })
    .then(({ data }) => parseGroupsResponse(data));

export const fetchStudentStats = (groupId: number, studentId: number) =>
  axiosInstance
    .get<StudentStatsResponse>(
      `/evaluationGroups/${groupId}/students/${studentId}`
    )
    .then(({ data }) => parseStudentStatsResponse(data));

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
  res: GroupDetailsResponse
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
  assignment: AssignmentResponse
): Assignment => ({
  dueDate: new Date(assignment.due_date),
  evaluationGroupReadingId: assignment.evaluation_group_reading_id,
  readingCategory: assignment.reading_category,
  readingId: assignment.reading_id,
  readingSubcategory: assignment.reading_subcategory ?? "",
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
  assignment: StudentStatsAssignment
): StudentAssignment => ({
  dueDate: new Date(assignment.due_date),
  evaluationGroupReadingId: assignment.id,
  readingCategory: assignment.reading_category,
  readingId: assignment.reading_id,
  readingSubcategory: assignment.reading_subcategory ?? "", // TODO Make this nullable in Assignment.ts model
  readingTitle: assignment.reading_title,
  score: assignment.score,
  status: assignment.status,
});

const parseMonthlyAverage = (
  monthlyAverage: StudentMonthlyAverage
): MonthlyAverage => ({
  groupAverageScore: monthlyAverage.group_avg_score,
  month: new Date(monthlyAverage.month).getMonth(),
  studentAverageScore: monthlyAverage.student_avg_score,
});

const parseStudentStatsResponse = (
  stats: StudentStatsResponse
): StudentStats => ({
  assignments: stats.Assignments.map(parseStudentAssignment),
  assignmentsDone: stats.assignments_done,
  assignmentsPending: stats.assignments_pending,
  assignmentsUncompleted: stats.assignments_delayed,
  averageScore: stats.average_score,
  monthlyAverages: stats.monthly_averages.map(parseMonthlyAverage),
});
