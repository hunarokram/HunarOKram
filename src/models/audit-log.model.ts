import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  organizerId: mongoose.Types.ObjectId;
  action: string;
  entity: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 days TTL

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
