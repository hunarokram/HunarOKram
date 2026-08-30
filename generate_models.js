const fs = require('fs');
const path = require('path');

const modelsDir = path.join('c:', 'code', 'anotherIdea', 'src', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const files = {
  'user.model.ts': `import mongoose, { Document, Schema } from 'mongoose';
import { GlobalRole } from '@/types/index';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  emailVerified: boolean;
  globalRole: GlobalRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  emailVerified: { type: Boolean, default: false },
  globalRole: { type: String, default: 'user' as GlobalRole }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
`,
  'session.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
`,
  'organizer.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganizer extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  contact: string;
  customDomain?: {
    hostname?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const organizerSchema = new Schema<IOrganizer>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  customDomain: {
    hostname: { type: String }
  }
}, { timestamps: true });

organizerSchema.index({ 'customDomain.hostname': 1 }, { sparse: true, unique: true });

export const Organizer = mongoose.models.Organizer || mongoose.model<IOrganizer>('Organizer', organizerSchema);
`,
  'experience.model.ts': `import mongoose, { Document, Schema } from 'mongoose';
import { ExperienceStatus } from '@/types/index';

export interface IExperience extends Document {
  organizerId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  status: ExperienceStatus;
  images: string[];
  pricing: number; // in paise
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, required: true },
  images: [{ type: String }],
  pricing: { type: Number, required: true } // in paise
}, { timestamps: true });

experienceSchema.index({ organizerId: 1, slug: 1 }, { unique: true });

export const Experience = mongoose.models.Experience || mongoose.model<IExperience>('Experience', experienceSchema);
`,
  'schedule.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule extends Document {
  experienceId: mongoose.Types.ObjectId;
  organizerId: mongoose.Types.ObjectId;
  startAt: Date;
  endAt: Date;
  capacity: number;
  bookedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const scheduleSchema = new Schema<ISchedule>({
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  capacity: { type: Number, required: true },
  bookedCount: { type: Number, default: 0 }
}, { timestamps: true });

scheduleSchema.index({ experienceId: 1, startAt: 1 });

export const Schedule = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', scheduleSchema);
`,
  'booking.model.ts': `import mongoose, { Document, Schema } from 'mongoose';
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
  amount: { type: Number, required: true } // paise
}, { timestamps: true });

bookingSchema.index({ idempotencyKey: 1 }, { sparse: true, unique: true });

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);
`,
  'customer.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  organizerId: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  email: { type: String, required: true }
}, { timestamps: true });

customerSchema.index({ organizerId: 1, email: 1 }, { unique: true });

export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
`,
  'payment.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

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
`,
  'review.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  organizerId: mongoose.Types.ObjectId;
  experienceId: mongoose.Types.ObjectId;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);
`,
  'subscription.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

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
`,
  'coupon.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

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
`,
  'notification.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

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
`,
  'audit-log.model.ts': `import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  organizerId: mongoose.Types.ObjectId;
  action: string;
  entity: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  organizerId: { type: Schema.Types.ObjectId, ref: 'Organizer', required: true },
  action: { type: String, required: true },
  entity: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // 90 days TTL

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
`,
  'index.ts': `export * from './user.model';
export * from './session.model';
export * from './organizer.model';
export * from './experience.model';
export * from './schedule.model';
export * from './booking.model';
export * from './customer.model';
export * from './payment.model';
export * from './review.model';
export * from './subscription.model';
export * from './coupon.model';
export * from './notification.model';
export * from './audit-log.model';
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(modelsDir, filename), content, 'utf8');
}
console.log('Done!');
