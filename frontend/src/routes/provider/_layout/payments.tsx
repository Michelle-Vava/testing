import { createFileRoute } from '@tanstack/react-router';
import { ProviderPayoutSettings } from '@/features/payments/components/ProviderPayoutSettings';

export const Route = createFileRoute('/provider/_layout/payments')({
  component: ProviderPayoutSettings,
});
