import { useQuery } from '@tanstack/react-query';

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await fetch('/api/customers');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch customers');
      return json.data;
    },
  });
}