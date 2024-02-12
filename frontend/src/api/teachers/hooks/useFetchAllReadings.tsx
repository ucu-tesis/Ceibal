import { useQuery } from '@tanstack/react-query';
import { fetchAllReadings } from '../teachers';

const useFetchAllReadings = () =>
  useQuery({
    queryKey: ['teacher', 'readings', 'all'],
    queryFn: () => fetchAllReadings(),
  });

export default useFetchAllReadings;
