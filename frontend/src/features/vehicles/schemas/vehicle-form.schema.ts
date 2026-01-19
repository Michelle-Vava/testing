import { z } from 'zod';

/**
 * Vehicle Form Validation Schema
 * 
 * Used by react-hook-form with zodResolver
 */
export const vehicleFormSchema = z.object({
  // VIN - optional, but if provided must be 17 chars
  vin: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length === 17,
      'VIN must be exactly 17 characters'
    ),

  // Make - required
  make: z
    .string()
    .min(1, 'Make is required')
    .max(50, 'Make must be less than 50 characters'),

  // Model - required
  model: z
    .string()
    .min(1, 'Model is required')
    .max(50, 'Model must be less than 50 characters'),

  // Year - required, must be between 1900 and current year + 1
  year: z
    .string()
    .min(1, 'Year is required')
    .refine(
      (val) => {
        const year = parseInt(val);
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear + 1;
      },
      'Year must be between 1900 and next year'
    ),

  // Color - optional
  color: z
    .string()
    .max(30, 'Color must be less than 30 characters')
    .optional(),

  // License Plate - optional
  licensePlate: z
    .string()
    .max(10, 'License plate must be less than 10 characters')
    .regex(/^[A-Z0-9\s-]*$/i, 'Invalid license plate format')
    .optional(),

  // Mileage - optional, positive number
  mileage: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = parseInt(val.replace(/,/g, ''));
        return !isNaN(num) && num >= 0 && num <= 999999;
      },
      'Mileage must be between 0 and 999,999'
    ),
});

export type VehicleFormData = z.infer<typeof vehicleFormSchema>;
