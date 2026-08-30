import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateScheduleInput, UpdateScheduleInput, ScheduleQueryInput } from '@/schemas/schedule.schema';

export type Schedule = {
  _id: string;
  experienceId: string;
  organizerId: string;
  startAt: string;
  endAt: string;
  sessions?: { startAt: string; endAt: string }[];
  capacity: number;
  bookedCount: number;
  createdAt: string;
  updatedAt: string;
};

type ScheduleResponse = {
  success: boolean;
  data: Schedule;
};

type SchedulesResponse = {
  success: boolean;
  data: Schedule[];
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

async function fetchSchedules(query?: ScheduleQueryInput): Promise<Schedule[]> {
  const url = new URL('/api/schedules', window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          url.searchParams.append(key, value.toISOString());
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    });
  }
  
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to fetch schedules'));
  return json.data;
}

async function fetchSchedule(id: string): Promise<Schedule> {
  const res = await fetch(`/api/schedules/${id}`);
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to fetch schedule'));
  return json.data;
}

async function createSchedule(data: CreateScheduleInput): Promise<Schedule> {
  const res = await fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to create schedule'));
  return json.data;
}

async function updateSchedule({ id, data }: { id: string; data: UpdateScheduleInput }): Promise<Schedule> {
  const res = await fetch(`/api/schedules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to update schedule'));
  return json.data;
}

async function rescheduleSchedule({ id, sessions }: { id: string; sessions: { startAt: string | Date; endAt: string | Date }[] }): Promise<Schedule> {
  const res = await fetch(`/api/schedules/${id}/reschedule`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessions }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to reschedule schedule'));
  return json.data;
}

async function deleteSchedule(id: string): Promise<{ deleted: boolean }> {
  const res = await fetch(`/api/schedules/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(extractError(json, 'Failed to delete schedule'));
  return json.data;
}

export function useSchedules(query?: ScheduleQueryInput) {
  return useQuery({
    queryKey: ['schedules', query],
    queryFn: () => fetchSchedules(query),
  });
}

export function useSchedule(id: string) {
  return useQuery({
    queryKey: ['schedules', id],
    queryFn: () => fetchSchedule(id),
    enabled: !!id,
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSchedule,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.setQueryData(['schedules', data._id], data);
    },
  });
}

export function useRescheduleSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rescheduleSchedule,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.setQueryData(['schedules', data._id], data);
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.removeQueries({ queryKey: ['schedules', id] });
    },
  });
}
