import { BaseTenantRepository } from './base.repository';
import { Coupon, ICoupon } from '../models/coupon.model';

export class CouponRepository extends BaseTenantRepository<ICoupon> {
  constructor() {
    super(Coupon);
  }
}

export const couponRepository = new CouponRepository();
