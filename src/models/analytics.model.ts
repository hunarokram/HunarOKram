import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsDaily extends Document {
  organizerId: mongoose.Types.ObjectId;
  date: string; // Format: YYYY-MM-DD
  views: number;
}

const analyticsDailySchema = new Schema<IAnalyticsDaily>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true, index: true },
  date: { type: String, required: true },
  views: { type: Number, default: 0 },
});

analyticsDailySchema.index({ organizerId: 1, date: 1 }, { unique: true });

export const AnalyticsDaily = mongoose.models.AnalyticsDaily || mongoose.model<IAnalyticsDaily>('AnalyticsDaily', analyticsDailySchema);
