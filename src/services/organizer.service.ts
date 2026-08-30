import mongoose from 'mongoose';
import { organizerRepository, userRepository } from '@/repositories';
import { ConflictError, NotFoundError } from '@/lib/errors/errors';
import { IOrganizer } from '@/models/organizer.model';

export class OrganizerService {
  async createOrganizer(userId: string, data: { name: string; slug: string; contact: { email: string } }) {
    const existing = await organizerRepository.findBySlug(data.slug);
    if (existing) {
      throw new ConflictError('Organizer slug is already taken');
    }

    const organizer = await organizerRepository.create({
      ownerId: new mongoose.Types.ObjectId(userId) as any,
      name: data.name,
      slug: data.slug,
      contact: data.contact,
    });

    await userRepository.update(userId, { globalRole: 'organizer' });

    return organizer;
  }

  async getCurrentOrganizer(userId: string) {
    const organizer = await organizerRepository.findOne({ ownerId: new mongoose.Types.ObjectId(userId) });
    if (!organizer) {
      throw new NotFoundError('Organizer profile not found');
    }
    return organizer;
  }

  async updateOrganizer(organizerId: string, data: Partial<IOrganizer> | any) {
    if (data.slug) {
      const existing = await organizerRepository.findBySlug(data.slug);
      if (existing && existing._id?.toString() !== organizerId.toString()) {
        throw new ConflictError('Organizer slug is already taken');
      }
    }

    const updated = await organizerRepository.update(organizerId, data);
    if (!updated) {
      throw new NotFoundError('Organizer profile not found');
    }
    return updated;
  }
}

export const organizerService = new OrganizerService();
