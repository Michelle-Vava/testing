import { SignIn, SignUp } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';

interface ClerkAuthPageProps {
  mode: 'owner' | 'provider';
  isLogin?: boolean;
}

/**
 * ClerkAuthPage - Authentication page using Clerk's pre-built components
 * 
 * Displays Clerk's SignIn or SignUp component with custom styling
 */
export function ClerkAuthPage({ mode, isLogin = true }: ClerkAuthPageProps) {
  const redirectUrl = mode === 'provider' ? '/provider/dashboard' : '/owner/dashboard';
  
  const features = mode === 'provider' 
    ? [
        "Access local service requests",
        "Set your own rates",
        "Build your reputation"
      ]
    : [
        "Verified & insured providers",
        "No spam calls",
        "Compare up to 5 quotes"
      ];

  const title = mode === 'provider'
    ? (isLogin ? "Welcome back, Provider" : "Start earning with Service Connect")
    : (isLogin ? "View your quotes and requests" : "Stop overpaying for car repairs");

  const subtitle = mode === 'provider'
    ? (isLogin ? "Sign in to manage your jobs and quotes." : "Join our network of verified automotive professionals.")
    : (isLogin ? "Welcome back to your dashboard." : "Get transparent quotes from verified providers.");

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">Service Connect</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-slate-300 mb-8">{subtitle}</p>

          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-slate-400">
          © 2026 Service Connect Automotive. All rights reserved.
        </div>
      </div>

      {/* Right panel - Clerk Auth */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Service Connect</span>
          </Link>
        </div>

        {/* Back to home link */}
        <div className="p-4 border-b">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Clerk component */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {/* Page title */}
          <div className="w-full max-w-md mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : `Join Service Connect as ${mode === 'provider' ? 'a Provider' : 'an Owner'}`}
            </h1>
            <p className="text-slate-600">
              {isLogin 
                ? `Sign in to your ${mode} account` 
                : mode === 'provider' 
                  ? 'Start earning by providing automotive services' 
                  : 'Get transparent quotes from verified providers'}
            </p>
          </div>

          {isLogin ? (
            <SignIn 
              routing="hash"
              signUpUrl={`/auth/signup?mode=${mode}`}
              forceRedirectUrl={redirectUrl}
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                  header: "hidden",
                  formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-medium",
                  footerActionLink: "text-slate-600 hover:text-slate-900 font-medium hover:underline",
                  footerAction: "hidden",
                },
              }}
            />
          ) : (
            <SignUp 
              routing="hash"
              signInUrl={`/auth/login?mode=${mode}`}
              forceRedirectUrl={redirectUrl}
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-none border-0",
                  header: "hidden",
                  formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-medium",
                  footerActionLink: "text-slate-600 hover:text-slate-900 font-medium hover:underline",
                  footerAction: "hidden",
                },
              }}
              unsafeMetadata={{
                role: mode,
              }}
            />
          )}

          {/* Login/Signup toggle */}
          <div className="w-full max-w-md mt-6 text-center text-sm text-slate-600">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Link 
                  to="/auth/signup" 
                  search={{ mode }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link 
                  to="/auth/login" 
                  search={{ mode }}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
