import { BaseTenantRepository } from './base.repository';
import { Review, IReview } from '../models/review.model';

export class ReviewRepository extends BaseTenantRepository<IReview> {
  constructor() {
    super(Review);
  }
}

export const reviewRepository = new ReviewRepository();
