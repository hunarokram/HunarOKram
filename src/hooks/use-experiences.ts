import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateExperienceInput, UpdateExperienceInput, ExperienceQueryInput } from '@/schemas/experience.schema';

export type Experience = {
  _id: string;
  organizerId: string;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  status: 'draft' | 'published' | 'archived';
  images: string[];
  price: number;
  currency: string;
  duration: number;
  location: {
    type: 'physical' | 'online' | 'hybrid';
    address?: string;
    mapUrl?: string;
  };
  tags: string[];
  offers?: {
    minQuantity: number;
    discountPercentage: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

type ExperienceResponse = {
  success: boolean;
  data: Experience;
};

type ExperiencesResponse = {
  success: boolean;
  data: Experience[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

function extractError(json: any, defaultMsg: string): string {
  if (!json?.error) return defaultMsg;
  let msg = json.error.message || defaultMsg;
  if (json.error.details) {
    const detailList = Object.entries(json.error.details).map(([k, v]) => {
      const field = k === '_root' ? 'General' : k.charAt(0).toUpperCase() + k.slice(1);
      return `${field}: ${(v as string[]).join(', ')}`;
    });
    if (detailList.length > 0) {
      msg = `${msg}\n- ${detailList.join('\n- ')}`;
    }
  }
  return msg;
}

async function fetchExperiences(query?: ExperienceQueryInput): Promise<ExperiencesResponse['data']> {
  const url = new URL('/api/experiences', window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to fetch experiences'));
  return json.data;
}

async function fetchExperience(id: string): Promise<Experience> {
  const res = await fetch(`/api/experiences/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to fetch experience'));
  return json.data;
}

async function createExperience(data: CreateExperienceInput): Promise<Experience> {
  const res = await fetch('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to create experience'));
  return json.data;
}

async function updateExperience({ id, data }: { id: string; data: UpdateExperienceInput }): Promise<Experience> {
  const res = await fetch(`/api/experiences/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to update experience'));
  return json.data;
}

async function deleteExperience(id: string): Promise<void> {
  const res = await fetch(`/api/experiences/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to delete experience'));
}

export function useExperiences(query?: ExperienceQueryInput) {
  return useQuery({
    queryKey: ['experiences', query],
    queryFn: () => fetchExperiences(query),
  });
}

export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experiences', id],
    queryFn: () => fetchExperience(id),
    enabled: !!id,
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExperience,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.setQueryData(['experiences', data._id], data);
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}
