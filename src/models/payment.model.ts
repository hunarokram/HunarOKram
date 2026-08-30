import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  providerOrderId: string;
  bookingId: mongoose.Types.ObjectId;
  amount: number; // paise
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  providerOrderId: { type: String, required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

paymentSchema.index({ providerOrderId: 1 });
paymentSchema.index({ bookingId: 1 });

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
