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
  
  // Supabase
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),

  // Auth
  JWT_SECRET: Joi.string().required(),
  
  // Stripe
  STRIPE_SECRET_KEY: Joi.string().required(),
});
