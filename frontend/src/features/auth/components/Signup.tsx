import { useNavigate, Link, useSearch } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useToast } from '@/components/ui/ToastContext';
import { ROUTES } from '@/lib/routes';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { AuthFormLayout } from './AuthFormLayout';
import { GoogleOAuthButton } from './GoogleOAuthButton';
import { FormField } from '@/components/ui/FormField';
import { PasswordField } from './PasswordField';

// Wrapper for SignupComponent
export function SignupComponent({ mode }: { mode: 'owner' | 'provider' }) {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const toast = useToast();
  const isProvider = mode === 'provider';
  const [isSuccess, setIsSuccess] = useState(false);

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
      const roles = mode === 'provider' ? ['provider', 'owner'] : ['owner'];
      
      await signup({
        name: `${formValues.firstName} ${formValues.lastName}`,
        email: formValues.email,
        password: formValues.password,
        roles,
      });

      // toast.success('Account created successfully!');
      setIsSuccess(true);
      
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

  const handlePostSignupAction = () => {
    if (mode === 'provider') {
      navigate({ to: '/provider/onboarding' });
    } else {
      navigate({ to: ROUTES.OWNER_DASHBOARD });
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center py-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isProvider ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <CheckCircle className={`w-10 h-10 ${isProvider ? 'text-yellow-600' : 'text-green-600'}`} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Your account is ready!</h3>
            <p className="text-slate-600 max-w-xs mx-auto">
              {isProvider 
                ? "Let's verify your business so you can start winning jobs." 
                : "Let's get your vehicle set up for your first quote."}
            </p>
          </div>

          <Button 
            size="lg" 
            className={`w-full max-w-xs ${isProvider ? 'bg-[#F5B700] hover:bg-yellow-500 text-slate-900' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            onClick={handlePostSignupAction}
          >
            {isProvider ? 'Start Verification' : 'Get My First Quote'}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Google OAuth Button */}
        <GoogleOAuthButton isProvider={false} />

        {/* Divider */}
        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center pt-2">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">or</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              type="text"
              placeholder=""
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white border-slate-300 text-slate-900 
                ${isProvider ? 'focus:ring-[#F5B700]' : 'focus:ring-blue-500'}
                ${errors.firstName ? 'border-red-500' : ''}
              `}
              {...register('firstName', { required: 'Required' })}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder=""
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white border-slate-300 text-slate-900 
                ${isProvider ? 'focus:ring-[#F5B700]' : 'focus:ring-blue-500'}
                ${errors.lastName ? 'border-red-500' : ''}
              `}
              {...register('lastName', { required: 'Required' })}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white border-slate-300 text-slate-900 
              ${isProvider ? 'focus:ring-[#F5B700] placeholder:text-slate-500' : 'focus:ring-blue-500'}
              ${errors.email ? 'border-red-500' : ''}
            `}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
          />
          {errors.email?.message && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Fields */}
         <div className="space-y-1">
            <label className={`block text-sm font-medium ${isProvider ? 'text-slate-300' : 'text-slate-700'}`}>
              Password
            </label>
           <PasswordField 
             register={register} 
             error={errors.password?.message}
             isProvider={isProvider}
           />
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="agreeToTerms"
              type="checkbox"
              className={`h-4 w-4 rounded border-gray-300 bg-white ${isProvider ? 'text-[#F5B700] focus:ring-[#F5B700]' : 'text-blue-600 focus:ring-blue-500'}`}
              {...register('agreeToTerms', { required: true })}
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="agreeToTerms" className="text-slate-600">
              I agree to the{' '}
              <Link to="/terms" className={`font-medium hover:underline ${isProvider ? 'text-[#F5B700]' : 'text-blue-600'}`}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className={`font-medium hover:underline ${isProvider ? 'text-[#F5B700]' : 'text-blue-600'}`}>
                Privacy Policy
              </Link>
            </label>
            {errors.agreeToTerms && (
               <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className={`w-full py-2.5 font-semibold text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
            ${isProvider 
              ? 'bg-[#F5B700] text-slate-900 hover:bg-yellow-500 focus-visible:outline-yellow-500' 
              : 'bg-slate-900 hover:bg-slate-800 focus-visible:outline-slate-900'
            }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  );
}

// Kept for backward compatibility
export function Signup({ onSwitchToLogin }: SignupProps) {
  const search = useSearch({ strict: false }) as { mode?: 'owner' | 'provider' };
  const mode = search?.mode || 'owner';
  
  return <SignupComponent mode={mode} />;
}
