import axiosInstance from "../axiosInstance";

interface GroupResponse {
  data: Group[];
}

export interface Group {
  id: number;
  name: string;
  school_year: number;
  teacher_id: number;
  created_by: number;
  school_data?: string; // TODO: Define type
}

export type GroupStudentsResponse = Group & {
  Students?: Student[];
  Assignments?: Assignment[];
};

export interface Student {
  id: number;
  cedula: string;
  first_name: string;
  last_name: string;
  email: string;
  assignments_done?: number;
  assignments_pending?: number;
}

export interface Assignment {
  evaluation_group_reading_id: number;
  reading_id: number;
  reading_title: string;
  chapter_id?: number;
  section_id?: number;
  due_date: string;
}

export const fetchGroupDetails = (groupId: number) =>
  axiosInstance
    .get<GroupStudentsResponse>(`/evaluationGroups/${groupId}`)
    .then((res) => res.data);

export const fetchGroups = (teacherCI: number) =>
  axiosInstance
    .get<GroupResponse>("/evaluationGroups", {
      params: { ci: teacherCI }, // TODO: Modify when backend changes the CI param.
    })
    .then((res) => res.data.data);
