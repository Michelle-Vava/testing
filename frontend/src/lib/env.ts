/**
 * Environment configuration
 * All environment variables accessed through this module
 */

export const env = {
  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4201/shanda',
  
  // Clerk Auth
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  
  // Supabase (database only)
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Stripe
  STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  
  // Sentry
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  
  // App
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  IS_PRODUCTION: import.meta.env.VITE_APP_ENV === 'production',
  IS_DEVELOPMENT: import.meta.env.VITE_APP_ENV === 'development',
} as const;

// Validate required environment variables
const requiredEnvVars = ['VITE_API_URL', 'VITE_CLERK_PUBLISHABLE_KEY'];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    console.warn(`Missing environment variable: ${envVar}`);
  }
}
