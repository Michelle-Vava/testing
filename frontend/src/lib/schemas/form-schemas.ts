import { z } from 'zod';

// Provider Onboarding Schema
export const providerOnboardingSchema = z.object({
  businessName: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  city: z.string()
    .min(1, 'City is required'),
  province: z.string()
    .min(1, 'Province is required'),
  serviceTypes: z.array(z.string())
    .min(1, 'Please select at least one service'),
  serviceRadius: z.number()
    .min(1, 'Service radius must be at least 1 km')
    .max(500, 'Service radius must be less than 500 km')
    .optional(),
});

export type ProviderOnboardingFormData = z.infer<typeof providerOnboardingSchema>;

// Quote Submission Schema
export const quoteSubmissionSchema = z.object({
  laborCost: z.string()
    .min(1, 'Labor cost is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a valid positive number'),
  partsCost: z.string()
    .min(1, 'Parts cost is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Must be a valid number'),
  estimatedDuration: z.string()
    .min(1, 'Estimated duration is required'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  includesWarranty: z.boolean().default(true),
});

export type QuoteSubmissionFormData = z.infer<typeof quoteSubmissionSchema>;

// Login Schema
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup Schema
export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters'),
  email: z.string()
    .email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['owner', 'provider']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Service Request Schema
export const serviceRequestSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  serviceType: z.string()
    .min(1, 'Service type is required'),
  urgency: z.enum(['low', 'medium', 'high', 'emergency']),
  preferredDate: z.date().optional(),
  vehicleId: z.string().optional(),
  // Vehicle fields for inline creation
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
});

export type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;
