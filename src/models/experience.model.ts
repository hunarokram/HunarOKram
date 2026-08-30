import mongoose, { Document, Schema } from 'mongoose';
import { ExperienceStatus } from '@/types/index';

export interface IExperience extends Document {
  organizerId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  status: ExperienceStatus;
  images: string[];
  price: number; // in paise
  currency: string; // usually 'INR'
  duration: number; // in minutes
  location: {
    type: 'physical' | 'online' | 'hybrid';
    address?: string;
    mapUrl?: string;
  };
  tags: string[];
  offers?: {
    minQuantity: number;
    discountPercentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String },
  status: { type: String, enum: ['draft', 'published', 'archived', 'past'], default: 'draft' },
  images: [{ type: String }],
  price: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  duration: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['physical', 'online', 'hybrid'], required: true },
    address: { type: String },
    mapUrl: { type: String },
  },
  tags: [{ type: String }],
  offers: [{
    minQuantity: { type: Number, required: true },
    discountPercentage: { type: Number, required: true }
  }]
}, { timestamps: true });

experienceSchema.index({ organizerId: 1, slug: 1 }, { unique: true });

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Experience;
}

export const Experience = mongoose.models.Experience || mongoose.model<IExperience>('Experience', experienceSchema);
