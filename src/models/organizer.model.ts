import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizer extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  mobileCoverImage?: string;
  pastCustomersCount?: number;
  contact: {
    email: string;
  };
  customDomain?: {
    hostname: string;
    verified: boolean;
  };
  paymentSettings?: {
    razorpayKeyId?: string;
    razorpayKeySecret?: string;
    razorpayWebhookSecret?: string;
    acceptedMethods?: 'razorpay' | 'manual' | 'both';
    manualPaymentUpiId?: string;
    manualPaymentQrCodeUrl?: string;
    manualPaymentLink?: string;
  };
  theme?: 'terracotta' | 'ocean' | 'forest' | 'midnight' | 'sunset' | 'lavender' | 'monochrome';
  subscriptionStatus?: 'free' | 'active' | 'past_due' | 'canceled' | 'pending_verification';
  subscriptionPaymentScreenshotUrl?: string;
  subscriptionPaymentDetails?: {
    transactionId: string;
    name: string;
    phone: string;
  };
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const organizerSchema = new Schema<IOrganizer>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  bio: { type: String },
  avatar: { type: String },
  coverImage: { type: String },
  mobileCoverImage: { type: String },
  pastCustomersCount: { type: Number, default: 0 },
  contact: {
    email: { type: String, required: true }
  },
  customDomain: {
    hostname: { type: String },
    verified: { type: Boolean, default: false }
  },
  paymentSettings: {
    razorpayKeyId: { type: String },
    razorpayKeySecret: { type: String },
    razorpayWebhookSecret: { type: String },
    acceptedMethods: { type: String, enum: ['razorpay', 'manual', 'both'], default: 'both' },
    manualPaymentUpiId: { type: String },
    manualPaymentQrCodeUrl: { type: String },
    manualPaymentLink: { type: String }
  },
  theme: { type: String, enum: ['terracotta', 'ocean', 'forest', 'midnight', 'sunset', 'lavender', 'monochrome'], default: 'terracotta' },
  subscriptionStatus: { type: String, enum: ['free', 'active', 'past_due', 'canceled', 'pending_verification'], default: 'free' },
  subscriptionPaymentScreenshotUrl: { type: String },
  subscriptionPaymentDetails: {
    transactionId: { type: String },
    name: { type: String },
    phone: { type: String }
  },
  subscriptionExpiresAt: { type: Date }
}, { timestamps: true });

organizerSchema.index({ 'customDomain.hostname': 1 }, { sparse: true, unique: true });

// Delete cached model in Next.js development to ensure schema updates take effect
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Organizer;
}

export const Organizer = mongoose.models.Organizer || mongoose.model<IOrganizer>('Organizer', organizerSchema);
