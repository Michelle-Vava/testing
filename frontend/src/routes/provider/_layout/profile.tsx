import { createFileRoute } from '@tanstack/react-router';
import { ProviderProfileSettings } from '@/features/provider/components/ProviderProfileSettings';

export const Route = createFileRoute('/provider/_layout/profile')({
  component: ProviderProfileSettings,
});
