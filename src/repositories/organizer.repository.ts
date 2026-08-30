import { BaseRepository } from './base.repository';
import { Organizer, IOrganizer } from '../models/organizer.model';

export class OrganizerRepository extends BaseRepository<IOrganizer> {
  constructor() {
    super(Organizer);
  }

  async findBySlug(slug: string) {
    return this.findOne({ slug });
  }
}

export const organizerRepository = new OrganizerRepository();
