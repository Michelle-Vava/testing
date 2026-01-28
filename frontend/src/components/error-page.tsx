import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function ErrorPage({ error, reset }: { error: Error; reset?: () => void }) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-600 mb-4">500</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>
        </div>

        {isDevelopment && error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="font-mono text-sm text-red-800 mb-2">
              <strong>Error:</strong> {error.message}
            </p>
            {error.stack && (
              <pre className="text-xs text-red-700 overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="space-y-4">
          {reset && (
            <Button onClick={reset} size="lg" className="mr-4">
              Try Again
            </Button>
          )}
          <Link to="/">
            <Button variant="outline" size="lg">
              Go Home
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If this problem persists, please{' '}
            <a href="mailto:support@serviceconnect.com" className="text-primary-600 hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
