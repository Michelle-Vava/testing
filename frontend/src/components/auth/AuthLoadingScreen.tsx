/**
 * AuthLoadingScreen - Displays a loading state during authentication
 * Used during initial auth check, role switching, and other auth operations
 */

export function AuthLoadingScreen({ message = 'Authenticating...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-6">
        {/* Animated Logo/Spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            {message}
          </h2>
          <p className="text-slate-400 text-sm">
            Please wait while we verify your credentials
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline loading spinner for smaller auth operations
 */
export function AuthLoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`${sizeClasses[size]} border-blue-500/30 border-t-blue-500 rounded-full animate-spin`}></div>
  );
}
