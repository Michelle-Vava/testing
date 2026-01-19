import { AuthLayout } from './AuthLayout';
import { LoginComponent } from './Login';
import { SignupComponent } from './Signup';
import { Link, useSearch } from '@tanstack/react-router';

// This is the container for Owner Auth
export function OwnerAuthPage({ isLogin = true }: { isLogin?: boolean }) {
  const illustration = (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Abstract car illustration */}
      <div className="bg-blue-50 rounded-2xl p-6 transform rotate-2 border border-blue-100 shadow-sm">
        <div className="h-4 w-32 bg-blue-200 rounded-full mb-4"></div>
        <div className="h-3 w-48 bg-slate-200 rounded-full mb-2"></div>
        <div className="h-3 w-24 bg-slate-200 rounded-full"></div>
        <div className="mt-6 flex justify-between items-end">
           <div className="h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center">
             <span className="text-xl">🚗</span>
           </div>
           <div className="h-8 w-16 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center justify-center">
             -20%
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      mode="owner"
      title={isLogin ? "View your quotes and requests" : "Stop overpaying for car repairs"}
      subtitle={isLogin ? "Welcome back to your dashboard." : "Get transparent quotes from verified providers. Compare before you decide."}
      features={[
        "Verified & insured providers",
        "No spam calls",
        "Compare up to 5 quotes"
      ]}
      illustration={illustration}
    >
      <div className="mb-8 text-center">
        <div className="inline-block p-3 bg-yellow-100 rounded-xl mb-4 text-yellow-600">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-slate-500 mt-2">
          {isLogin 
            ? 'Sign in to view your quotes and requests.' 
            : 'Join free to start getting fair car repair quotes.'}
        </p>
      </div>

      {isLogin ? (
        <LoginComponent mode="owner" />
      ) : (
        <SignupComponent mode="owner" />
      )}
      
      <div className="mt-6 text-center text-sm text-slate-500">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <Link to="/auth/signup" search={{ mode: 'owner' }} className="text-blue-600 font-semibold hover:underline">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/auth/login" search={{ mode: 'owner' }} className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </>
        )}
      </div>
      <div className="mt-4 text-center text-xs text-slate-400">
        You can switch roles anytime.
      </div>
    </AuthLayout>
  );
}
