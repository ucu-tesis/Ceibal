import { useUser } from '../UserContext';

export const useIsStudent = () => useUser()?.type === 'student';

export const useIsTeacher = () => useUser()?.type === 'teacher';
