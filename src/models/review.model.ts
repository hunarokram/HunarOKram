import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  organizerId: mongoose.Types.ObjectId;
  experienceId?: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  customerName: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: false },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: false },
  customerName: { type: String, required: true }
}, { timestamps: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Review;
}

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
