import { BaseRepository } from './base.repository';
import { User, IUser } from '../models/user.model';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }
}

export const userRepository = new UserRepository();
