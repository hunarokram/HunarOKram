import { BaseTenantRepository } from './base.repository';
import { Subscription, ISubscription } from '../models/subscription.model';

export class SubscriptionRepository extends BaseTenantRepository<ISubscription> {
  constructor() {
    super(Subscription);
  }
}

export const subscriptionRepository = new SubscriptionRepository();
