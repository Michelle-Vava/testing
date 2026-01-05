import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  onChange?: any;
  onBlur?: any;
  ref?: any;
}

/**
 * Animated form field with error display
 */
export function FormField({
  id,
  label,
  type = 'text',
  error,
  placeholder,
  autoComplete,
  ...rest
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <motion.input
        id={id}
        type={type}
        {...rest}
        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
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
}
