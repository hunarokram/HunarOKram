/**
 * Environment variable configuration and validation.
 * Lazily validates required environment variables to prevent startup crashes in tooling,
 * but ensures they are present when the application actually runs.
 */

export interface PublicEnv {
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_PLATFORM_DOMAIN: string;
}

export interface ServerEnv {
  MONGODB_URI: string;
  AUTH_SECRET: string;
  COOKIE_DOMAIN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  R2_BUCKET_NAME: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_PUBLIC_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

export type Env = PublicEnv & ServerEnv;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const publicEnv = {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_PLATFORM_DOMAIN: process.env.NEXT_PUBLIC_PLATFORM_DOMAIN,
  };

  const serverEnv = {
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH_SECRET: process.env.AUTH_SECRET,
    COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  };

  const allEnv = { ...publicEnv, ...serverEnv };
  const missingVars: string[] = [];

  for (const [key, value] of Object.entries(allEnv)) {
    if (key !== 'NODE_ENV' && (value === undefined || value === '')) {
      // In a real browser environment, process.env is replaced at build time,
      // so server vars will be undefined. We only throw if we are on the server
      // and it's missing.
      if (typeof window === 'undefined') {
        missingVars.push(key);
      } else if (key.startsWith('NEXT_PUBLIC_')) {
        missingVars.push(key);
      }
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  cachedEnv = allEnv as Env;
  return cachedEnv;
}
