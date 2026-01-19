import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for the PasswordField component.
 */
interface PasswordFieldProps {
  id?: string;
  placeholder?: string;
  error?: string;
  showStrengthIndicator?: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Password input field with visibility toggle, strength indicator, and caps lock warning.
 * 
 * Features:
 * - Toggle password visibility
 * - Password strength indicator (optional)
 * - Caps lock warning
 * - Animated error display
 * 
 * @component
 * @example
 * ```tsx
 * <PasswordField
 *   id="password"
 *   placeholder="Enter password"
 *   error={errors.password?.message}
 *   showStrengthIndicator={true}
 *   {...register('password')}
 * />
 * ```
 */
// PasswordField with updated styles
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps & { register?: any, isProvider?: boolean }>(({
  id = 'password',
  placeholder = '••••••••',
  error,
  showStrengthIndicator = true,
  isProvider = false,
  register, // react-hook-form register
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [password, setPassword] = useState('');

  const passwordStrength = getPasswordStrength(password);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (rest.onChange) rest.onChange(e);
  };

  // Allow passing react-hook-form register directly
  const registration = register ? register(id, {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' }
  }) : {};

  return (
    <div>
      <div className="relative">
        <motion.input
          id={id}
          type={showPassword ? 'text' : 'password'}
          
          {...registration}
          {...rest}
          ref={(e) => {
            // Merge refs: react-hook-form ref + forwarded ref
            if (registration.ref) {
              registration.ref(e);
            }
            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              (ref as any).current = e;
            }
          }}
          
          onChange={(e) => {
             registration.onChange?.(e);
             handleChange(e);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyDown}
          onBlur={registration.onBlur}
          
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all pr-10
            bg-white border-slate-300 text-slate-900 placeholder:text-slate-500
            ${isProvider 
              ? 'focus:ring-[#F5B700]' 
              : 'focus:ring-blue-500'
            }
            ${error ? 'border-red-500' : ''}
          `}
          placeholder={placeholder}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.15 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity ${isProvider ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>


      {/* Password Strength Indicator */}
      {showStrengthIndicator && password && (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1"
          >
            <div className="flex gap-1">
              <div className={`h-1 flex-1 rounded ${password.length >= 1 ? getStrengthColor(passwordStrength) : 'bg-slate-200'}`} />
              <div className={`h-1 flex-1 rounded ${password.length >= 8 ? getStrengthColor(passwordStrength) : 'bg-slate-200'}`} />
              <div className={`h-1 flex-1 rounded ${password.length >= 12 && /[A-Z]/.test(password) ? getStrengthColor(passwordStrength) : 'bg-slate-200'}`} />
            </div>
            <p className={`text-xs ${getStrengthTextColor(passwordStrength)}`}>
              {getStrengthText(passwordStrength)}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Caps Lock Warning */}
      <AnimatePresence mode="wait">
        {capsLockOn && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-sm text-yellow-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Caps Lock is on
          </motion.p>
        )}
        {error && !capsLockOn && (
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

PasswordField.displayName = 'PasswordField';

// Helper functions
function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (!password) return 'weak';
  if (password.length < 8) return 'weak';
  if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    return 'strong';
  }
  if (password.length >= 8 && (/[A-Z]/.test(password) || /[0-9]/.test(password))) {
    return 'medium';
  }
  return 'weak';
}

function getStrengthColor(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'strong': return 'bg-green-500';
  }
}

function getStrengthTextColor(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak': return 'text-red-600';
    case 'medium': return 'text-yellow-600';
    case 'strong': return 'text-green-600';
  }
}

function getStrengthText(strength: 'weak' | 'medium' | 'strong'): string {
  switch (strength) {
    case 'weak': return 'Weak password';
    case 'medium': return 'Medium strength';
    case 'strong': return 'Strong password';
  }
}

// Icon components
function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}
