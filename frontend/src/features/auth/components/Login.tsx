import { useNavigate, Link, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/config/routes';
import { useState } from 'react';
import { GoogleOAuthButton } from './GoogleOAuthButton';
import { PasswordField } from './PasswordField';
import { FormField } from './FormField';
import { AuthFormLayout } from './AuthFormLayout';
import { ForgotPasswordSection } from './ForgotPasswordSection';
import { Button } from '@/components/ui/button';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  onSwitchToSignup?: () => void;
}

export function Login({ onSwitchToSignup }: LoginProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { mode?: 'owner' | 'provider' };
  const mode = search?.mode || 'owner';
  const { login, user } = useAuth();
  const toast = useToast();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (formValues: LoginFormValues) => {
    try {
      const loggedInUser = await login(formValues.email, formValues.password);
      toast.success('Welcome back!');
      
      // Route based on mode and provider profile status
      if (mode === 'provider') {
        // User wants provider mode
        if (loggedInUser.providerOnboardingComplete) {
          navigate({ to: '/provider/dashboard' });
        } else {
          navigate({ to: '/provider/onboarding' });
        }
      } else {
        // Default to owner dashboard
        navigate({ to: ROUTES.OWNER_DASHBOARD });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      
      if (message.includes('Invalid credentials') || message.includes('password')) {
        setError('password', { 
          type: 'manual', 
          message: "That email/password combo doesn't look right." 
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <AuthFormLayout 
      mode={mode}
      authType="login"
      title="Welcome back"
      subtitle="Compare verified quotes. No spam."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <GoogleOAuthButton />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">or</span>
          </div>
        </div>

        {/* Email Field */}
        <FormField
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })}
        />

        {/* Password Field with Forgot Password Link */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(!showForgotPassword)}
              className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <PasswordField
            id="password"
            placeholder="••••••••"
            error={errors.password?.message}
            showStrengthIndicator={false}
            {...register('password', { required: 'Password is required' })}
          />
        </div>

        {/* Forgot Password Section */}
        <ForgotPasswordSection 
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 text-slate-900 focus:ring-slate-500 border-slate-300 rounded cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700 cursor-pointer">
            Keep me signed in
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Trust Signal */}
        <p className="text-xs text-center text-slate-500">
          Your data is encrypted in transit. We never share your info without permission.
        </p>
      </form>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          {onSwitchToSignup ? (
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-slate-900 hover:text-slate-700 font-medium hover:underline"
            >
              Sign up
            </button>
          ) : (
            <Link to="/auth/signup" className="text-slate-900 hover:text-slate-700 font-medium hover:underline">
              Sign up
            </Link>
          )}
        </p>
      </div>
    </AuthFormLayout>
  );
}
