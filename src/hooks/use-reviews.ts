import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateReviewInput } from '@/schemas/review.schema';

export type Review = {
  _id: string;
  organizerId: string;
  experienceId: string;
  rating: number;
  comment?: string;
  customerName: string;
  createdAt: string;
  updatedAt: string;
};

export function useExperienceReviews(experienceId: string) {
  return useQuery({
    queryKey: ['reviews', 'experience', experienceId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?experienceId=${experienceId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch reviews');
      return json.data as Review[];
    },
    enabled: !!experienceId,
  });
}

export function useOrganizerReviews() {
  return useQuery({
    queryKey: ['reviews', 'organizer'],
    queryFn: async () => {
      const res = await fetch('/api/reviews?forOrganizer=true');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch reviews');
      return json.data as Review[];
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateReviewInput) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to create review');
      return json.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'experience', variables.experienceId] });
    },
  });
}
export function useCreateManualReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { customerName: string; rating: number; comment?: string }) => {
      const res = await fetch('/api/reviews/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to add review');
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'organizer'] });
    },
  });
}
