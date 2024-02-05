import axiosInstance from '@/api/axiosInstance';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  type: string;
}

interface UserContextValue {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  loading: true,
});

export const useUser = () => {
  return useContext(UserContext).user as User;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isStudentRoute = router.pathname.startsWith('/alumno');
  const isTeacherRoute = router.pathname.startsWith('/maestro');
  const isProtectedRoute = isStudentRoute || isTeacherRoute;

  useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      setUser(userData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const value = {
    user,
    loading,
  };

  useEffect(() => {
    if (loading) return;

    if (!user && (isStudentRoute || isTeacherRoute)) {
      router.replace('/login');
    }

    if (user?.type === 'teacher' && isStudentRoute) {
      router.replace('/maestro/grupos');
    } else if (user?.type === 'student' && isTeacherRoute) {
      router.replace('/alumno');
    }
  }, [user, isStudentRoute, isTeacherRoute, router, loading]);

  return (
    <UserContext.Provider value={value}>
      {loading || (isProtectedRoute && !user) ? null : children}
    </UserContext.Provider>
  );
};

const fetchUserData = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/auth/user-init');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status !== 401) {
        console.error('Error fetching user data:', axiosError);
      }
    } else {
      console.error('Unknown error:', error);
    }
    return null;
  }
};
