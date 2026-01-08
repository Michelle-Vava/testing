import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Loader2 } from 'lucide-react';

/**
 * OAuth Callback Handler
 * 
 * Handles the redirect from Google OAuth via Supabase.
 * Exchanges the auth code for a session and syncs with backend.
 */
function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithSupabase } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from Supabase after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get session');
          setTimeout(() => navigate({ to: '/auth/login' }), 2000);
          return;
        }

        if (!session) {
          console.error('No session found');
          setError('No session found');
          setTimeout(() => navigate({ to: '/auth/login' }), 2000);
          return;
        }

        // Get user data from Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('User error:', userError);
          setError('Failed to get user data');
          setTimeout(() => navigate({ to: '/auth/login' }), 2000);
          return;
        }

        // Sync with your backend by using the Supabase access token
        // Your backend should validate this token with Supabase
        await loginWithSupabase(session.access_token);
        
        // Redirect to dashboard
        navigate({ to: '/' });
      } catch (error) {
        console.error('Callback error:', error);
        setError('Authentication failed');
        setTimeout(() => navigate({ to: '/auth/login' }), 2000);
      }
    };

    handleCallback();
  }, [loginWithSupabase, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          {error ? error : 'Completing sign in...'}
        </h2>
        {error && (
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
});
