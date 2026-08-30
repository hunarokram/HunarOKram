import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  organizerId: mongoose.Types.ObjectId;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  plan: { type: String, required: true }
}, { timestamps: true });

export const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);
