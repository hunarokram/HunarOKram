import { BaseTenantRepository } from './base.repository';
import { Customer, ICustomer } from '../models/customer.model';

export class CustomerRepository extends BaseTenantRepository<ICustomer> {
  constructor() {
    super(Customer);
  }
}

export const customerRepository = new CustomerRepository();
