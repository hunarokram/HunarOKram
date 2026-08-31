import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSettings extends Document {
  adminUpiId: string;
  adminUpiName: string;
  subscriptionPrice: number;
  adminQrCodeUrl?: string;
}

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    adminUpiId: { type: String, default: 'admin@upi' },
    adminUpiName: { type: String, default: 'HunarOKram' },
    subscriptionPrice: { type: Number, default: 299 },
    adminQrCodeUrl: { type: String },
  },
  { timestamps: true }
);

// We only ever need one document in this collection
export const SystemSettings = mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', systemSettingsSchema);
