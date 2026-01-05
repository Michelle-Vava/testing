import { createFileRoute } from '@tanstack/react-router';
import { AuthContainer } from '@/features/auth/components/AuthContainer';

export const Route = createFileRoute('/auth/login')({
  component: AuthContainer,
});
