import { createFileRoute } from '@tanstack/react-router';
import { ResetPassword } from '@/features/auth/components/ResetPassword';

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPassword,
});
