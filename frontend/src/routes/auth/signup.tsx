import { createFileRoute } from '@tanstack/react-router';
import { ClerkAuthPage } from '@/features/auth/components/ClerkAuthPage';

export const Route = createFileRoute('/auth/signup')({
  component: SignupPage,
  validateSearch: (search: Record<string, unknown>) => ({
    mode: (search.mode as 'owner' | 'provider') || 'owner',
  }),
});

function SignupPage() {
  const { mode } = Route.useSearch();
  return <ClerkAuthPage mode={mode} isLogin={false} />;
}
