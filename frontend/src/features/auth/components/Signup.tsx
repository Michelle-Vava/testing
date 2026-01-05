import { useNavigate, Link, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/config/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthFormLayout } from './AuthFormLayout';
import { GoogleOAuthButton } from './GoogleOAuthButton';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

interface SignupProps {
  onSwitchToLogin?: () => void;
}

export function Signup({ onSwitchToLogin }: SignupProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: '/auth/signup' }) as { role?: string };
  const role = search?.role;
  const { signup } = useAuth();
  const toast = useToast();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setError } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (formValues: SignupFormValues) => {
    if (!formValues.agreeToTerms) {
      setError('agreeToTerms', {
        type: 'manual',
        message: 'Please agree to the Terms and Privacy Policy'
      });
      return;
    }

    try {
      const roles = role === 'provider' ? ['provider'] : ['owner'];
      
      await signup({
        name: `${formValues.firstName} ${formValues.lastName}`,
        email: formValues.email,
        password: formValues.password,
        roles,
      });

      toast.success('Account created successfully!');
      navigate({ to: ROUTES.OWNER_DASHBOARD });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      
      if (message.includes('email') && message.includes('exists')) {
        setError('email', { 
          type: 'manual', 
          message: 'Looks like you already have an account. Try signing in instead.' 
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  const roleContext = role === 'provider' ? {
    role: 'provider' as const,
    message: 'Creating a mechanic account',
    switchLink: '/auth/signup',
    switchText: 'Not a mechanic?'
  } : undefined;

  return (
    <AuthFormLayout
      title="Create your account"
      subtitle="Compare verified quotes. No spam."
      role={roleContext?.role}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Google OAuth Button */}
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

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="firstName"
            label="First name"
            error={errors.firstName?.message}
            placeholder="John"
            autoComplete="given-name"
            {...register('firstName', { required: 'First name is required' })}
          />
          <FormField
            id="lastName"
            label="Last name"
            error={errors.lastName?.message}
            placeholder="Doe"
            autoComplete="family-name"
            {...register('lastName', { required: 'Last name is required' })}
          />
        </div>

        {/* Email Field */}
        <FormField
          id="email"
          label="Email address"
          type="email"
          error={errors.email?.message}
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address'
            }
          })}
        />

        {/* Password Field */}
        <PasswordField
          register={register}
          errors={errors}
          password={password}
          showStrengthIndicator
        />

        {/* Terms Checkbox */}
        <div>
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register('agreeToTerms', { required: true })}
              className="h-4 w-4 mt-0.5 text-slate-900 focus:ring-slate-500 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-slate-700 cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-slate-900 hover:text-slate-700 font-medium hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-slate-900 hover:text-slate-700 font-medium hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          <AnimatePresence mode="wait">
            {errors.agreeToTerms && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1.5 text-sm text-red-600"
              >
                {errors.agreeToTerms.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>

        {/* Trust Signal */}
        <p className="text-xs text-center text-slate-500">
          No spam. No phone calls. Your data is encrypted in transit.
        </p>
      </form>

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-slate-900 hover:text-slate-700 font-medium hover:underline"
            >
              Sign in
            </button>
          ) : (
            <Link to="/auth/login" className="text-slate-900 hover:text-slate-700 font-medium hover:underline">
              Sign in
            </Link>
          )}
        </p>
      </div>
    </AuthFormLayout>
  );
}
