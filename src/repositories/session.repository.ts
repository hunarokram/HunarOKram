import { BaseRepository } from './base.repository';
import { Session, ISession } from '../models/session.model';

export class SessionRepository extends BaseRepository<ISession> {
  constructor() {
    super(Session);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.model.deleteOne({ token }).exec();
  }
}

export const sessionRepository = new SessionRepository();
