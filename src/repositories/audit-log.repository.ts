import { BaseTenantRepository } from './base.repository';
import { AuditLog, IAuditLog } from '../models/audit-log.model';

export class AuditLogRepository extends BaseTenantRepository<IAuditLog> {
  constructor() {
    super(AuditLog);
  }
}

export const auditLogRepository = new AuditLogRepository();
