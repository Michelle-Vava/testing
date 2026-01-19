import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * AuthErrorBoundary - Catches authentication-related errors
 * Provides user-friendly error messages and recovery options
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught:', error, errorInfo);
    
    // Log to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    // Clear auth state and reload
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error;
      const isNetworkError = error?.message.includes('fetch') || error?.message.includes('network');
      const isAuthError = error?.message.toLowerCase().includes('auth') || 
                          error?.message.toLowerCase().includes('unauthorized') ||
                          error?.message.toLowerCase().includes('forbidden');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
          <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-8 space-y-6">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            {/* Error Title */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                {isNetworkError ? 'Connection Error' : isAuthError ? 'Authentication Error' : 'Something Went Wrong'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isNetworkError && 'Unable to connect to the server. Please check your internet connection.'}
                {isAuthError && 'There was a problem verifying your credentials. Please sign in again.'}
                {!isNetworkError && !isAuthError && 'An unexpected error occurred. We\'re sorry for the inconvenience.'}
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-slate-900/50 rounded p-3 text-xs font-mono text-red-400 max-h-40 overflow-auto">
                {error.message}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
              <Button 
                onClick={this.handleReset} 
                variant="outline"
                className="w-full border-slate-600 hover:bg-slate-700"
              >
                Sign Out & Reset
              </Button>
            </div>

            {/* Help Link */}
            <p className="text-center text-sm text-slate-500">
              Need help?{' '}
              <a href="/support" className="text-blue-400 hover:text-blue-300 underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
