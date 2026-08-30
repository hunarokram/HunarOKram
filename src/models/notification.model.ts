import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  organizerId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  channel: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  recipientId: { type: Schema.Types.ObjectId, required: true },
  channel: { type: String, required: true }
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);
