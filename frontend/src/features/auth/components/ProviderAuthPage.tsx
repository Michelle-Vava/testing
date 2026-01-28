import { AuthLayout } from './AuthLayout';
import { LoginComponent } from './Login';
import { SignupComponent } from './Signup';
import { Link } from '@tanstack/react-router';

/**
 * ProviderAuthPage Component
 * 
 * This component renders the authentication page specifically for Service Providers.
 * It toggles between Login and Signup modes based on the `isLogin` prop.
 * 
 * Features:
 * - Uses `AuthLayout` to provide a consistent split-screen design.
 * - Displays a provider-specific illustration (Abstract dashboard).
 * - Delegates actual form logic to `LoginComponent` and `SignupComponent` with `mode="provider"`.
 * - Provides navigation links to switch between Login and Signup.
 */
export function ProviderAuthPage({ isLogin = true }: { isLogin?: boolean }) {
  const illustration = (
     <div className="relative w-full max-w-sm mx-auto">
      {/* Abstract dashboard illustration - Visual decoration only */}
      <div className="bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-xl">
        <div className="bg-slate-900 rounded p-4">
           {/* Visual placeholder for dashboard rows */}
           <div className="flex gap-2 mb-4">
             <div className="w-1/3 h-20 bg-slate-800 rounded animate-pulse"></div>
             <div className="w-1/3 h-20 bg-slate-800 rounded animate-pulse delay-75"></div>
             <div className="w-1/3 h-20 bg-slate-800 rounded animate-pulse delay-150"></div>
           </div>
           
           <div className="space-y-2">
             <div className="h-8 w-full bg-slate-800 rounded flex items-center px-2">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <div className="h-2 w-24 bg-slate-700 rounded"></div>
             </div>
             <div className="h-8 w-full bg-slate-800 rounded flex items-center px-2">
                <div className="h-2 w-2 bg-slate-600 rounded-full mr-2"></div>
                <div className="h-2 w-32 bg-slate-700 rounded"></div>
             </div>
             <div className="h-8 w-full bg-slate-800 rounded flex items-center px-2">
                <div className="h-2 w-2 bg-slate-600 rounded-full mr-2"></div>
                <div className="h-2 w-20 bg-slate-700 rounded"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      mode="provider"
      title={isLogin ? "Manage your quotes and jobs" : "Get More Jobs. No Cold Calling."}
      subtitle={isLogin ? "Welcome back to your partner dashboard." : "Receive verified service requests and quote only on the work you want."}
      features={[
        "Requests from real vehicle owners",
        "Set your own pricing",
        "No exclusivity contracts"
      ]}
      illustration={illustration}
    >
      <div className="mb-8 text-center">
        <div className="inline-block p-3 bg-slate-900 rounded-xl mb-4 text-[#F5B700]">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isLogin ? 'Provider Portal' : 'Apply as a Provider'}
        </h2>
        <p className="text-slate-600 mt-2">
          {isLogin 
            ? 'Sign in to manage your quotes and jobs.' 
            : 'Grow your business with verified leads on Service Connect.'}
        </p>
      </div>

      {isLogin ? (
        <LoginComponent mode="provider" />
      ) : (
        <SignupComponent mode="provider" />
      )}

      <div className="mt-6 text-center text-sm text-slate-400">
        {isLogin ? (
          <>
            New to Service Connect?{' '}
            <Link to="/auth/signup" search={{ mode: 'provider' }} className="text-[#F5B700] font-semibold hover:underline">
              Apply now
            </Link>
          </>
        ) : (
          <>
            Already a partner?{' '}
            <Link to="/auth/login" search={{ mode: 'provider' }} className="text-[#F5B700] font-semibold hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
      <div className="mt-4 text-center text-xs text-slate-500">
        You can switch roles anytime.
      </div>
    </AuthLayout>
  );
}
