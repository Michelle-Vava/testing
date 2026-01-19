import { createFileRoute } from '@tanstack/react-router';
import { ProviderJobsList } from '@/features/jobs/components/lists/ProviderJobsList';

export const Route = createFileRoute('/provider/_layout/jobs/')({
  component: ProviderJobsList,
});
