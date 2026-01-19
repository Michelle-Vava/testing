import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Server
  PORT: Joi.number().default(4201),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  FRONTEND_URL: Joi.string().uri().required(),

  // Database
  DATABASE_URL: Joi.string().required(),
  
  // Supabase (for database only)
  SUPABASE_URL: Joi.string().uri().optional(),
  SUPABASE_ANON_KEY: Joi.string().optional(),

  // Clerk Auth
  CLERK_SECRET_KEY: Joi.string().required(),
  CLERK_PUBLISHABLE_KEY: Joi.string().required(),
  CLERK_WEBHOOK_SECRET: Joi.string().optional(), // Required in production
  CLERK_JWT_KEY: Joi.string().optional(), // Public key for JWT verification
  
  // Legacy JWT (can be removed once migration complete)
  JWT_SECRET: Joi.string().optional(),
  
  // Stripe
  STRIPE_SECRET_KEY: Joi.string().required(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  // Resend Email
  RESEND_API_KEY: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().default('onboarding@resend.dev'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});
