import { createFileRoute } from '@tanstack/react-router';
import { ProviderRequestDetail } from '@/features/requests/components/ProviderRequestDetail';

export const Route = createFileRoute('/provider/_layout/requests/$requestId')({
  component: ProviderRequestDetail,
});
