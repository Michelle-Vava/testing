import { createFileRoute } from '@tanstack/react-router';
import { ProviderSetup } from '@/features/provider/components/ProviderSetup';

export const Route = createFileRoute('/provider/provider-setup')({
  component: ProviderSetup,
});
