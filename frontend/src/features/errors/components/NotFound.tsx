import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Go Home
          </Link>
          <div className="text-sm text-gray-500">
            <p>Need help? <a href="mailto:support@shanda.com" className="text-primary-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth/login" className="text-primary-600 hover:underline text-sm">Sign In</Link>
            <Link to="/auth/signup" className="text-primary-600 hover:underline text-sm">Get Started</Link>
            <Link to="/help" className="text-primary-600 hover:underline text-sm">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
