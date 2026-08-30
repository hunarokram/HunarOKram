import { BaseTenantRepository } from './base.repository';
import { Types } from 'mongoose';
import { Experience, IExperience } from '../models/experience.model';

export class ExperienceRepository extends BaseTenantRepository<IExperience> {
  constructor() {
    super(Experience);
  }

  async findBySlug(organizerId: string | Types.ObjectId, slug: string) {
    return this.findOne(organizerId, { slug });
  }
}

export const experienceRepository = new ExperienceRepository();
