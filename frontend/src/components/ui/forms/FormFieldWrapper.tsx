import React from 'react';

interface FormFieldWrapperProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactNode;
}

/**
 * Form field wrapper component for custom inputs
 * 
 * Use this when you need to provide your own input element as a child.
 * For standard text inputs, use the FormField component instead.
 * 
 * @example
 * ```tsx
 * <FormFieldWrapper label="Email" error={errors.email?.message} required>
 *   <input type="email" {...register('email')} />
 * </FormFieldWrapper>
 * ```
 */
export function FormFieldWrapper({ 
  label, 
  error, 
  required, 
  helpText, 
  children 
}: FormFieldWrapperProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {helpText && (
        <p className="text-xs text-slate-500 mb-2">{helpText}</p>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
