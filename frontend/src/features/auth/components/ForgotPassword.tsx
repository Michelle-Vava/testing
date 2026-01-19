import { Link } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/ToastContext';
import { AXIOS_INSTANCE } from '@/lib/axios';
import { validateField, VALIDATION_RULES, getInputClasses, renderError } from '@/utils/validation';

export function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateField(email, VALIDATION_RULES.email);
    setError(validationError || '');
  };

  const handleChange = (value: string) => {
    setEmail(value);
    if (touched) {
      const validationError = validateField(value, VALIDATION_RULES.email);
      setError(validationError || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    const validationError = validateField(email, VALIDATION_RULES.email);
    setError(validationError || '');
    
    if (validationError) return;
    
    setIsSubmitting(true);
    try {
      await AXIOS_INSTANCE.post('/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error: any) {
      // Error handled globally but keeping this for specific UX logic if needed
      // toast.error is redundant here as interceptor handles it, but harmless
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md" padding="lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
            <Link to="/auth/login">
              <Button variant="outline" fullWidth>
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              className={getInputClasses(touched && !!error)}
              placeholder="you@example.com"
            />
            {renderError(touched ? error : undefined)}
          </div>
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <div className="text-center text-sm">
            <Link to="/auth/login" className="text-primary-600 hover:underline">
              ← Back to Sign In
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

