import { AlertCircle } from 'lucide-react';
import React from 'react';

export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  type?: 'text' | 'number' | 'select';
  placeholder?: string;
  helpText?: string;
  options?: Array<{ value: string; label: string } | string>;
  className?: string;
  inputMode?: 'text' | 'numeric';
  maxLength?: number;
}

/**
 * Reusable form field component with validation display
 * 
 * Features:
 * - Label with required indicator
 * - Error state styling
 * - Help text below field
 * - Supports text inputs and selects
 */
export function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  type = 'text',
  placeholder,
  helpText,
  options,
  className = '',
  inputMode,
  maxLength
}: FormFieldProps) {
  const hasError = error && touched;
  const baseInputClass = `w-full px-4 py-3 border rounded-lg transition-all ${
    hasError
      ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : 'border-slate-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
  } ${className}`;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {required && '*'}
      </label>

      {type === 'select' && options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${baseInputClass} appearance-none bg-white`}
          aria-label={label}
        >
          {options.map((option, index) => {
            if (typeof option === 'string') {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value || index} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type === 'number' ? 'text' : type}
          inputMode={inputMode}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={baseInputClass}
        />
      )}

      {helpText && !hasError && (
        <p className="mt-1 text-sm text-slate-500">{helpText}</p>
      )}

      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
