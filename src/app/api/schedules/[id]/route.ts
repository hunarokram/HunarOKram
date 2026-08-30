import { requireAuth } from '@/lib/auth/guard';
import { parseBody, apiSuccess, withErrorHandler } from '@/middleware/api-middleware';
import { updateScheduleSchema } from '@/schemas/schedule.schema';
import { scheduleService } from '@/services/schedule.service';
import { organizerRepository } from '@/repositories/index';
import { ForbiddenError, NotFoundError } from '@/lib/errors/errors';
import { scheduleRepository } from '@/repositories/schedule.repository';

async function getOrganizerId(userId: string) {
  const organizer = await organizerRepository.findOne({ ownerId: userId });
  if (!organizer) {
    throw new ForbiddenError('You must complete organizer onboarding first');
  }
  return organizer._id.toString();
}

export const GET = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  const params = await context.params;
  const id = params.id as string;
  
  const schedule = await scheduleRepository.findById(organizerId, id);
  if (!schedule) {
    throw new NotFoundError('Schedule not found');
  }
  
  return apiSuccess(schedule, 200);
});

export const PATCH = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  const params = await context.params;
  const id = params.id as string;
  
  const data = await parseBody(request, updateScheduleSchema);
  
  const schedule = await scheduleService.updateSchedule(organizerId, id, data);
  
  return apiSuccess(schedule, 200);
});

export const DELETE = withErrorHandler(async (request, context) => {
  const auth = await requireAuth();
  const organizerId = await getOrganizerId(auth.userId);
  const params = await context.params;
  const id = params.id as string;
  
  await scheduleService.deleteSchedule(organizerId, id);
  
  return apiSuccess({ deleted: true }, 200);
});
