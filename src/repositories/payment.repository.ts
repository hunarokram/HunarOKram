import { BaseTenantRepository } from './base.repository';
import { Payment, IPayment } from '../models/payment.model';

export class PaymentRepository extends BaseTenantRepository<IPayment> {
  constructor() {
    super(Payment);
  }
}

export const paymentRepository = new PaymentRepository();
