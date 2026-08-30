import mongoose, { Document, Schema } from 'mongoose';
import { BookingStatus } from '@/types/index';

export interface IBooking extends Document {
  bookingNumber: string;
  idempotencyKey?: string;
  organizerId: mongoose.Types.ObjectId;
  experienceId: mongoose.Types.ObjectId;
  scheduleId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  status: BookingStatus;
  amount: number; // paise
  quantity: number;
  checkedInCount: number;
  paymentMethod?: 'razorpay' | 'manual';
  paymentScreenshotUrl?: string;
  paymentProviderOrderId?: string;
  feedbackEmailSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  bookingNumber: { type: String, required: true, unique: true },
  idempotencyKey: { type: String },
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: String, required: true },
  amount: { type: Number, required: true }, // paise
  quantity: { type: Number, default: 1 },
  checkedInCount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['razorpay', 'manual'], default: 'razorpay' },
  paymentScreenshotUrl: { type: String },
  paymentProviderOrderId: { type: String },
  feedbackEmailSent: { type: Boolean, default: false }
}, { timestamps: true });

bookingSchema.index({ idempotencyKey: 1 }, { sparse: true, unique: true });
bookingSchema.index({ scheduleId: 1, status: 1 });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Booking;
}

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
