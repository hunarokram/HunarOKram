/**
 * Subscription plans and entitlements configuration.
 */

export type PlanLevel = 'FREE' | 'CREATOR' | 'STUDIO' | 'PRO';

export interface PlanEntitlements {
  maxExperiences: number;
  maxImagesPerExperience: number;
  customDomain: boolean;
  analyticsLevel: 'basic' | 'standard' | 'advanced';
  maxStaffMembers: number;
  prioritySupport: boolean;
  customBranding: boolean;
  maxSchedulesPerExperience: number;
  automatedReminders: boolean;
}

export const PLANS: Record<PlanLevel, PlanEntitlements> = {
  FREE: {
    maxExperiences: 2,
    maxImagesPerExperience: 3,
    customDomain: false,
    analyticsLevel: 'basic',
    maxStaffMembers: 1,
    prioritySupport: false,
    customBranding: false,
    maxSchedulesPerExperience: 4,
    automatedReminders: false,
  },
  CREATOR: {
    maxExperiences: 5,
    maxImagesPerExperience: 10,
    customDomain: false,
    analyticsLevel: 'standard',
    maxStaffMembers: 1,
    prioritySupport: false,
    customBranding: true,
    maxSchedulesPerExperience: 20,
    automatedReminders: true,
  },
  STUDIO: {
    maxExperiences: 20,
    maxImagesPerExperience: 20,
    customDomain: true,
    analyticsLevel: 'advanced',
    maxStaffMembers: 5,
    prioritySupport: true,
    customBranding: true,
    maxSchedulesPerExperience: 100,
    automatedReminders: true,
  },
  PRO: {
    maxExperiences: -1, // Unlimited
    maxImagesPerExperience: 50,
    customDomain: true,
    analyticsLevel: 'advanced',
    maxStaffMembers: -1, // Unlimited
    prioritySupport: true,
    customBranding: true,
    maxSchedulesPerExperience: -1, // Unlimited
    automatedReminders: true,
  },
} as const;

export function getEntitlements(plan: PlanLevel): PlanEntitlements {
  return PLANS[plan];
}
