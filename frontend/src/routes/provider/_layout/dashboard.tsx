import { createFileRoute } from '@tanstack/react-router';
import { ProviderDashboard } from '@/features/provider/components/ProviderDashboard';

export const Route = createFileRoute('/provider/_layout/dashboard')({
  component: ProviderDashboard,
});
