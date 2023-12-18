import { Assignment } from "@/models/Assignment";
import { AssignmentReading } from "@/models/AssignmentReading";
import { Group } from "@/models/Group";
import { GroupDetails } from "@/models/GroupDetails";
import { Student } from "@/models/Student";
import axiosInstance from "../axiosInstance";
import { RepeatedWords } from "@/models/Stats";

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

interface AssignmentStatsResponse {
  assignment: {
    due_date: string;
    created_at: string;
    reading: {
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

export const fetchAssignmentStats = (evaluationGroupId: number, evaluationGroupReadingId: number) => {
  axiosInstance.get<AssignmentStatsResponse>(
    `evaluationGroups/${evaluationGroupId}/assignments/${evaluationGroupReadingId}`
  );
};

// Parse methods

const parseGroupsResponse = (res: GroupsResponse): Group[] => res.data.map(parseGroupResponse);

const parseGroupResponse = (group: GroupResponse): Group => ({
  createdBy: group.created_by,
  schoolYear: group.school_year,
  teacherId: group.teacher_id,
  schoolData: group.school_data,
  ...group,
});

const parseGroupDetailsResponse = (res: GroupDetailsResponse): GroupDetails => ({
  createdBy: res.created_by,
  id: res.id,
  name: res.name,
  schoolYear: res.school_year,
  schoolData: res.school_data,
  teacherId: res.teacher_id,
  assignments: res.Assignments?.map(parseAssignmentResponse) ?? [],
  students: res.Students?.map(parseStudentResponse) ?? [],
});

const parseAssignmentResponse = (assignment: AssignmentResponse): Assignment => ({
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
  ...student,
});
