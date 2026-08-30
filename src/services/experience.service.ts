import { experienceRepository } from '@/repositories/index';
import { CreateExperienceInput, UpdateExperienceInput, ExperienceQueryInput } from '@/schemas/experience.schema';
import { NotFoundError, ConflictError } from '@/lib/errors/errors';
import { slugify } from '@/utils/string';
import { Types } from 'mongoose';
import { scheduleRepository } from '@/repositories/schedule.repository';

import { organizerRepository } from '@/repositories/index';
import { ForbiddenError } from '@/lib/errors/errors';

export class ExperienceService {
  /**
   * Generates a unique slug within an organizer's scope
   */
  private async generateUniqueSlug(organizerId: string | Types.ObjectId, title: string, baseSlug?: string): Promise<string> {
    const slugBasis = baseSlug || slugify(title);
    let testSlug = slugBasis;
    let counter = 1;
    
    while (await experienceRepository.findBySlug(organizerId, testSlug)) {
      testSlug = `${slugBasis}-${counter}`;
      counter++;
    }
    
    return testSlug;
  }

  async createExperience(organizerId: string | Types.ObjectId, data: CreateExperienceInput) {
    // 1. Subscription check
    const organizer = await organizerRepository.findById(organizerId);
    if (!organizer) {
      throw new NotFoundError('Organizer not found');
    }

    let isExpired = false;
    if (organizer.subscriptionExpiresAt && new Date() > new Date(organizer.subscriptionExpiresAt)) {
      isExpired = true;
    }

    if (organizer.subscriptionStatus === 'active' && !isExpired) {
      // Unlimited access - do nothing, let them create
    } else if (isExpired) {
      throw new ForbiddenError('Your subscription has expired. Please renew your plan to create new workshops.');
    } else {
      // This is the Free lifetime limit (never subscribed, or still on initial free tier)
      const existingExperiences = await experienceRepository.findMany(organizerId, {});
      if (existingExperiences.length >= 2) {
        throw new ForbiddenError('You can only conduct 2 free workshops. Please upgrade to a ₹299 subscription to create more.');
      }
    }

    const slug = await this.generateUniqueSlug(organizerId, data.title, data.slug);
    
    const experienceData = {
      ...data,
      slug,
      organizerId: new Types.ObjectId(organizerId) as any
    };

    return experienceRepository.create(organizerId, experienceData);
  }

  async getExperiences(organizerId: string | Types.ObjectId, query: ExperienceQueryInput) {
    const filter: any = {};
    
    if (query.status) {
      filter.status = query.status;
    }
    
    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } }
      ];
    }

    const experiences = await experienceRepository.findMany(organizerId, filter);
    
    // Manual sorting/pagination for simplicity in this mockup, 
    // though usually handled by repository with aggregation or find options.
    let result = experiences;
    if (query.sortBy) {
      result.sort((a: any, b: any) => {
        const aVal = a[query.sortBy!];
        const bVal = b[query.sortBy!];
        if (aVal < bVal) return query.sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return query.sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      result.sort((a: any, b: any) => b.createdAt?.getTime() - a.createdAt?.getTime());
    }

    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const paginatedResult = result.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paginatedResult,
      total: result.length,
      page,
      pageSize,
      totalPages: Math.ceil(result.length / pageSize)
    };
  }

  async getExperienceById(organizerId: string | Types.ObjectId, id: string | Types.ObjectId) {
    const experience = await experienceRepository.findById(organizerId, id);
    if (!experience) {
      throw new NotFoundError('Experience not found');
    }
    return experience;
  }

  async updateExperience(organizerId: string | Types.ObjectId, id: string | Types.ObjectId, data: UpdateExperienceInput) {
    const experience = await this.getExperienceById(organizerId, id);

    let newSlug = experience.slug;
    if (data.title && data.title !== experience.title || data.slug && data.slug !== experience.slug) {
      const slugBasis = data.slug || (data.title ? slugify(data.title) : undefined);
      if (slugBasis && slugBasis !== experience.slug) {
        newSlug = await this.generateUniqueSlug(organizerId, slugBasis);
      }
    }

    const updateData = {
      ...data,
      ...(newSlug !== experience.slug ? { slug: newSlug } : {})
    };

    const updated = await experienceRepository.update(organizerId, id, updateData);
    if (!updated) {
      throw new NotFoundError('Experience not found');
    }
    return updated;
  }

  async archiveExperience(organizerId: string | Types.ObjectId, id: string | Types.ObjectId) {
    const experience = await this.getExperienceById(organizerId, id);
    
    if (experience.status === 'archived') {
      return experience;
    }
    
    const updated = await experienceRepository.update(organizerId, id, { status: 'archived' });
    if (!updated) {
      throw new NotFoundError('Experience not found');
    }
    
    return updated;
  }

  async deleteExperience(organizerId: string | Types.ObjectId, id: string | Types.ObjectId) {
    const experience = await this.getExperienceById(organizerId, id);
    
    const schedules = await scheduleRepository.findMany(organizerId, { experienceId: id });
    const ongoingSchedules = schedules.filter((s: any) => new Date(s.endAt) >= new Date() || s.bookedCount > 0);
    
    if (ongoingSchedules.length > 0) {
      throw new ConflictError('Cannot delete an experience that has upcoming schedules or active bookings. Please cancel or delete them first.');
    }

    const deleted = await experienceRepository.delete(organizerId, id);
    if (!deleted) {
      throw new NotFoundError('Experience not found');
    }
    
    return deleted;
  }
}

export const experienceService = new ExperienceService();
