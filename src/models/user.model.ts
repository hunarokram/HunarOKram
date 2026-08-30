import mongoose, { Document, Schema } from 'mongoose';
import { GlobalRole } from '@/types/index';

export interface IUser extends Document {
  email: string;
  pendingEmail?: string;
  passwordHash?: string;
  emailVerified: boolean;
  verificationCode?: string;
  verificationExpiresAt?: Date;
  globalRole: GlobalRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  pendingEmail: { type: String },
  passwordHash: { type: String },
  emailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  verificationExpiresAt: { type: Date },
  globalRole: { type: String, default: 'user' as GlobalRole }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
