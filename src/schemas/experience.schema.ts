import { z } from 'zod';
import { priceSchema, safeStringSchema, slugSchema, urlSchema, paginationSchema, searchSchema, sortSchema } from './common.schema';

const locationSchema = z.object({
  type: z.enum(['physical', 'online', 'hybrid']),
  address: safeStringSchema(500).optional(),
  mapUrl: urlSchema.optional().or(z.literal('')),
});

export const createExperienceSchema = z.object({
  title: z.string().min(3, 'Title is too short').max(100).transform(v => v.trim().replace(/<[^>]*>/g, '')),
  slug: slugSchema.optional(), // Can be auto-generated
  description: z.string().min(10, 'Description is too short'),
  shortDescription: safeStringSchema(200).optional(),
  price: priceSchema,
  currency: z.literal('INR').default('INR'),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  location: locationSchema,
  tags: z.array(safeStringSchema(30)).max(10, 'Too many tags').default([]),
  offers: z.array(z.object({
    minQuantity: z.number().int().min(2),
    discountPercentage: z.number().min(1).max(100)
  })).default([]),
  status: z.enum(['draft', 'published', 'archived', 'past']).default('draft'),
  images: z.array(urlSchema).max(10, 'Too many images').default([]),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const experienceQuerySchema = z.object({
  status: z.enum(['draft', 'published', 'archived', 'past']).optional(),
}).merge(paginationSchema).merge(searchSchema).merge(sortSchema);

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
export type ExperienceQueryInput = z.infer<typeof experienceQuerySchema>;
