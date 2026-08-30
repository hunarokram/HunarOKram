import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  organizerId: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  email: { type: String, required: true },
  name: { type: String },
  phone: { type: String }
}, { timestamps: true });

customerSchema.index({ organizerId: 1, email: 1 }, { unique: true });

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
