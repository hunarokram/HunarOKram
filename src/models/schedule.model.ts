import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  experienceId: mongoose.Types.ObjectId;
  organizerId: mongoose.Types.ObjectId;
  startAt: Date;
  endAt: Date;
  sessions?: { startAt: Date; endAt: Date }[];
  capacity: number;
  bookedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema({
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true }
}, { _id: false });

const scheduleSchema = new Schema<ISchedule>({
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  sessions: { type: [sessionSchema], default: [] },
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 }
}, { timestamps: true });

scheduleSchema.index({ experienceId: 1, startAt: 1 });

export const Schedule = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', scheduleSchema);
