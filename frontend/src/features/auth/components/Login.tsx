import { useNavigate, Link, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useToast } from '@/components/ui/ToastContext';
import { ROUTES } from '@/lib/routes';
import { useState } from 'react';
import { GoogleOAuthButton } from './GoogleOAuthButton';
import { PasswordField } from './PasswordField';
import { FormField } from '@/components/ui/FormField';
import { AuthFormLayout } from './AuthFormLayout';
import { ForgotPasswordSection } from './ForgotPasswordSection';
import { Button } from '@/components/ui/button';

// Simple wrapper to be used inside OwnerAuthPage or ProviderAuthPage
export function LoginComponent({ mode }: { mode: 'owner' | 'provider' }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const isProvider = mode === 'provider';

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
      
      // Determine target route based on USER ROLE first (source of truth), then fall back to mode
      // This prevents providers from landing on owner dashboard if they used the wrong login link
      
      // Check for provider role/status
      const hasProviderRole = loggedInUser.roles?.includes('provider');
      const isProviderMode = mode === 'provider';

      if (hasProviderRole || (isProviderMode && (!loggedInUser.roles || loggedInUser.roles.length === 0))) {
        // Robust check for onboarding completion
        const isProviderOnboarded = 
          loggedInUser.providerStatus === 'ACTIVE' || 
          loggedInUser.providerStatus === 'PENDING' || 
          loggedInUser.providerOnboardingComplete;

        if (isProviderOnboarded) {
          navigate({ to: '/provider/dashboard' });
        } else {
          navigate({ to: '/provider/onboarding' });
        }
      } else {
        // Default to Owner Dashboard
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

  if (showForgotPassword) {
    return <ForgotPasswordSection onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <GoogleOAuthButton isProvider={isProvider} />

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
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white border-slate-300 text-slate-900 
              ${isProvider ? 'focus:ring-[#F5B700]' : 'focus:ring-blue-500'}
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

        {/* Password Field */}
        <div className="space-y-1">
           <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <button
               type="button"
               onClick={() => setShowForgotPassword(true)}
               className={`text-sm hover:underline ${isProvider ? 'text-[#F5B700]' : 'text-blue-600'}`}
             >
               Forgot password?
             </button>
           </div>
           <PasswordField 
             register={register} 
             error={errors.password?.message}
             isProvider={isProvider}
             showStrengthIndicator={false}
           />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className={`h-4 w-4 rounded border-gray-300 ${isProvider ? 'text-[#F5B700] focus:ring-[#F5B700]' : 'text-blue-600 focus:ring-blue-500'}`}
            {...register('rememberMe')}
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
            Remember me
          </label>
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
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </div>
  );
}

// Keeping original export for backward compatibility if needed elsewhere
export function Login({ onSwitchToSignup }: LoginProps) {
  const search = useSearch({ strict: false }) as { mode?: 'owner' | 'provider' };
  const mode = search?.mode || 'owner';
  
  return <LoginComponent mode={mode} />;
}
