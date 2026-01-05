import { useNavigate, useSearch } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/contexts/ToastContext';
import axios from 'axios';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { validateField, VALIDATION_RULES, getInputClasses, renderError } from '@/shared/utils/validation';

export function ResetPassword() {
  const navigate = useNavigate();
  const toast = useToast();
  const { token, email } = useSearch({ from: '/auth/reset-password' }) as { token?: string; email?: string };
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const rules = {
      newPassword: VALIDATION_RULES.password,
      confirmPassword: VALIDATION_RULES.confirmPassword(newPassword),
    };
    const error = validateField(
      field === 'newPassword' ? newPassword : confirmPassword,
      rules[field as keyof typeof rules]
    );
    setErrors({ ...errors, [field]: error || '' });
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (touched.newPassword) {
      const newPasswordError = validateField(value, VALIDATION_RULES.password);
      setErrors({ ...errors, newPassword: newPasswordError || '' });
    }
    // Also revalidate confirm password if it's been touched
    if (touched.confirmPassword) {
      const newPasswordError = validateField(value, VALIDATION_RULES.password);
      const confirmError = validateField(confirmPassword, VALIDATION_RULES.confirmPassword(value));
      setErrors({ ...errors, newPassword: newPasswordError || '', confirmPassword: confirmError || '' });
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      const error = validateField(value, VALIDATION_RULES.confirmPassword(newPassword));
      setErrors({ ...errors, confirmPassword: error || '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid reset link');
      return;
    }

    // Mark all as touched
    setTouched({ newPassword: true, confirmPassword: true });

    // Validate all fields
    const passwordError = validateField(newPassword, VALIDATION_RULES.password);
    const confirmError = validateField(confirmPassword, VALIDATION_RULES.confirmPassword(newPassword));
    
    const newErrors = {
      newPassword: passwordError || '',
      confirmPassword: confirmError || '',
    };
    
    setErrors(newErrors);
    
    if (passwordError || confirmError) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${env.API_URL}/auth/reset-password`, {
        token,
        newPassword,
      });
      toast.success('Password reset successfully!');
      navigate({ to: ROUTES.LOGIN });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Button onClick={() => navigate({ to: '/auth/forgot-password' })}>
              Request New Link
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
          {email && (
            <p className="mt-2 text-sm text-gray-600">
              Resetting password for {email}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('newPassword')}
              className={getInputClasses(touched.newPassword && !!errors.newPassword)}
              placeholder="At least 8 characters"
            />
            {renderError(touched.newPassword ? errors.newPassword : undefined)}
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              className={getInputClasses(touched.confirmPassword && !!errors.confirmPassword)}
              placeholder="Confirm your password"
            />
            {renderError(touched.confirmPassword ? errors.confirmPassword : undefined)}
          </div>
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

