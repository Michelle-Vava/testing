/**
 * Vehicle form validation utilities
 */

export interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  mileage: string;
  vin: string;
}

export interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  color?: string;
  mileage?: string;
  vin?: string;
}

/**
 * Validate a single form field
 * 
 * @param name - Field name
 * @param value - Field value
 * @returns Error message or undefined if valid
 */
export function validateField(name: string, value: string): string | undefined {
  switch (name) {
    case 'year':
      if (value && (isNaN(Number(value)) || Number(value) < 1980 || Number(value) > new Date().getFullYear() + 1)) {
        return `Year must be between 1980 and ${new Date().getFullYear() + 1}`;
      }
      break;
    case 'mileage':
      if (value && (isNaN(Number(value.replace(/,/g, ''))) || Number(value.replace(/,/g, '')) < 0)) {
        return 'Mileage must be a positive number';
      }
      break;
    case 'vin':
      if (value && value.length > 0 && value.length !== 17) {
        return 'VIN must be exactly 17 characters';
      }
      if (value && !/^[A-HJ-NPR-Z0-9]+$/i.test(value)) {
        return 'VIN can only contain letters and numbers (excluding I, O, Q)';
      }
      break;
    case 'licensePlate':
      if (!value) {
        return 'License plate is required';
      }
      break;
    case 'make':
    case 'model':
    case 'color':
      if (!value) {
        return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
      break;
  }
  return undefined;
}

/**
 * Validate all form fields
 * 
 * @param formData - Complete form data object
 * @returns Object with error messages for invalid fields
 */
export function validateAllFields(formData: VehicleFormData): FormErrors {
  const errors: FormErrors = {};
  
  Object.keys(formData).forEach(key => {
    const error = validateField(key, formData[key as keyof VehicleFormData]);
    if (error) {
      errors[key as keyof FormErrors] = error;
    }
  });

  return errors;
}

/**
 * Format mileage with thousand separators
 */
export function formatMileage(value: string): string {
  const num = value.replace(/,/g, '');
  if (isNaN(Number(num))) return value;
  return Number(num).toLocaleString();
}

/**
 * Format license plate (uppercase, trimmed)
 */
export function formatLicensePlate(value: string): string {
  return value.toUpperCase().trim();
}

/**
 * Format VIN (uppercase, alphanumeric only, no I/O/Q)
 */
export function formatVIN(value: string): string {
  return value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, '');
}
