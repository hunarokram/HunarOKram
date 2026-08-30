import { z } from 'zod';
import { objectIdSchema } from './common.schema';

const sessionInputSchema = z.object({
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
}).refine((data) => data.startAt < data.endAt, {
  message: 'Session startAt must be before endAt',
  path: ['endAt'],
});

export const createScheduleSchema = z.object({
  experienceId: objectIdSchema,
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  sessions: z.array(sessionInputSchema).optional(),
  capacity: z.number().int().positive('Capacity must be greater than 0'),
}).refine((data) => data.startAt <= data.endAt, {
  message: 'startAt must be before or equal to endAt',
  path: ['endAt'],
});

export const updateScheduleSchema = z.object({
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  sessions: z.array(sessionInputSchema).optional(),
  capacity: z.number().int().positive('Capacity must be greater than 0').optional(),
}).refine((data) => {
  if (data.startAt && data.endAt) {
    return data.startAt <= data.endAt;
  }
  return true;
}, {
  message: 'startAt must be before or equal to endAt',
  path: ['endAt'],
});

export const scheduleQuerySchema = z.object({
  experienceId: objectIdSchema.optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type ScheduleQueryInput = z.infer<typeof scheduleQuerySchema>;
