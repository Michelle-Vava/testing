import React from 'react';
// Professional form validation utilities

export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  validate?: (value: any) => boolean | string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Please enter a valid email address',
  },
  phone: {
    value: /^\+?[\d\s-()]+$/,
    message: 'Please enter a valid phone number',
  },
  zipCode: {
    value: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    message: 'Please enter a valid Canadian postal code (e.g., K1A 0B1)',
  },
  url: {
    value: /^https?:\/\/.+/i,
    message: 'Please enter a valid URL',
  },
};

// Common validation rules
export const VALIDATION_RULES = {
  email: {
    required: 'Email is required',
    pattern: VALIDATION_PATTERNS.email,
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  },
  confirmPassword: (password: string) => ({
    required: 'Please confirm your password',
    validate: (value: string) =>
      value === password || 'Passwords do not match',
  }),
  phoneNumber: {
    required: 'Phone number is required',
    validate: (value: string) => {
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 || 'Please enter a valid phone number';
    },
  },
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  },
  address: {
    required: 'Address is required',
    minLength: {
      value: 5,
      message: 'Please enter a complete address',
    },
  },
  city: {
    required: 'City is required',
    minLength: {
      value: 2,
      message: 'Please enter a valid city name',
    },
  },
  state: {
    required: 'State/Province is required',
  },
  zipCode: {
    required: 'ZIP/Postal code is required',
    minLength: {
      value: 3,
      message: 'Please enter a valid postal code',
    },
  },
  message: {
    required: 'Message is required',
    minLength: {
      value: 10,
      message: 'Message must be at least 10 characters',
    },
  },
};

// Validation function for controlled forms
export function validateField(
  value: any,
  rules: ValidationRule
): string | undefined {
  // Required check
  if (rules.required) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return typeof rules.required === 'string'
        ? rules.required
        : 'This field is required';
    }
  }

  // Skip other validations if value is empty and not required
  if (!value || (typeof value === 'string' && !value.trim())) {
    return undefined;
  }

  // Min length check
  if (rules.minLength && typeof value === 'string') {
    if (value.length < rules.minLength.value) {
      return rules.minLength.message;
    }
  }

  // Max length check
  if (rules.maxLength && typeof value === 'string') {
    if (value.length > rules.maxLength.value) {
      return rules.maxLength.message;
    }
  }

  // Pattern check
  if (rules.pattern && typeof value === 'string') {
    if (!rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }
  }

  // Min value check
  if (rules.min !== undefined && typeof value === 'number') {
    if (value < rules.min.value) {
      return rules.min.message;
    }
  }

  // Max value check
  if (rules.max !== undefined && typeof value === 'number') {
    if (value > rules.max.value) {
      return rules.max.message;
    }
  }

  // Custom validation
  if (rules.validate) {
    const result = rules.validate(value);
    if (typeof result === 'string') {
      return result;
    }
    if (result === false) {
      return 'Invalid value';
    }
  }

  return undefined;
}

// Validate entire form
export function validateForm(
  values: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((field) => {
    const error = validateField(values[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

// Input styles helper
export function getInputClasses(hasError?: boolean, disabled?: boolean): string {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors';
  const errorClasses = hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-300';
  const disabledClasses = disabled
    ? 'bg-gray-50 cursor-not-allowed opacity-60'
    : '';

  return `${baseClasses} ${errorClasses} ${disabledClasses}`.trim();
}

// Error message component helper
export function renderError(error?: string): React.ReactElement | null {
  if (!error) return null;
  return <p className="mt-1 text-sm text-red-600">{error}</p>;
}
