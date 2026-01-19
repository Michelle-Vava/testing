import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

/**
 * Animated form field with error display
 * 
 * Designed for use with react-hook-form via forwardRef.
 * 
 * @example
 * ```tsx
 * const { register, formState: { errors } } = useForm();
 * <FormField
 *   id="email"
 *   label="Email"
 *   type="email"
 *   error={errors.email?.message}
 *   {...register('email')}
 * />
 * ```
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  id,
  label,
  type = 'text',
  error,
  placeholder,
  autoComplete,
  className,
  ...rest
}, ref) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <motion.input
        ref={ref}
        id={id}
        type={type}
        {...rest}
        className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all ${className || ''}`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
      />
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

FormField.displayName = 'FormField';
