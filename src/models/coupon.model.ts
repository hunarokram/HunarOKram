import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  organizerId: mongoose.Types.ObjectId;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  code: { type: String, required: true }
}, { timestamps: true });

couponSchema.index({ organizerId: 1, code: 1 }, { unique: true });

export const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', couponSchema);
