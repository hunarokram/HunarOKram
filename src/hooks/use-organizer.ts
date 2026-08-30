import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { createOrganizerSchema, updateOrganizerSchema } from '@/schemas/organizer.schema';

export type Organizer = {
  _id: string;
  name: string;
  slug: string;
  avatar?: string;
  coverImage?: string;
  mobileCoverImage?: string;
  contact: {
    email: string;
  };
  customDomain?: {
    hostname?: string;
    verified?: boolean;
  };
  paymentSettings?: {
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
    razorpayWebhookSecret?: string;
  };
  createdAt: string;
  updatedAt: string;
  theme?: 'terracotta' | 'ocean' | 'forest' | 'midnight' | 'sunset' | 'lavender' | 'monochrome';
  subscriptionStatus?: 'free' | 'active' | 'past_due' | 'canceled' | 'pending_verification';
  subscriptionPaymentScreenshotUrl?: string;
  subscriptionExpiresAt?: string;
};

type OrganizerResponse = {
  success: boolean;
  data: Organizer;
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

async function fetchCurrentOrganizer(): Promise<Organizer | null> {
  const res = await fetch('/api/organizers/me');
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch organizer');
  }
  const json: OrganizerResponse = await res.json();
  return json.data;
}

async function createOrganizer(data: z.infer<typeof createOrganizerSchema>): Promise<Organizer> {
  const res = await fetch('/api/organizers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to create organizer'));
  return json.data;
}

async function updateOrganizer(data: z.infer<typeof updateOrganizerSchema>): Promise<Organizer> {
  const res = await fetch('/api/organizers/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to update organizer'));
  return json.data;
}

export function useCurrentOrganizer() {
  return useQuery({
    queryKey: ['current-organizer'],
    queryFn: fetchCurrentOrganizer,
    retry: false,
  });
}

export function useCreateOrganizer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganizer,
    onSuccess: (data) => {
      queryClient.setQueryData(['current-organizer'], data);
    },
  });
}

export function useUpdateOrganizer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganizer,
    onSuccess: (data) => {
      queryClient.setQueryData(['current-organizer'], data);
    },
  });
}
