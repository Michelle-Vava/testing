import { createFileRoute } from '@tanstack/react-router';
import { OwnerProviderList } from '@/features/providers/components/OwnerProviderList';

export const Route = createFileRoute('/owner/_layout/providers/')({
  component: OwnerProviderList,
});
