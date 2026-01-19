import { createFileRoute } from '@tanstack/react-router';
import { OwnerProviderDetail } from '@/features/providers/components/OwnerProviderDetail';

export const Route = createFileRoute('/owner/_layout/providers/$providerId')({
  component: OwnerProviderDetail,
});
