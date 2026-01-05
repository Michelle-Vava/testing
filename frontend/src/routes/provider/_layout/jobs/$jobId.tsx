import { createFileRoute } from '@tanstack/react-router';
import { ProviderJobDetail } from '@/features/jobs/components/ProviderJobDetail';

export const Route = createFileRoute('/provider/_layout/jobs/$jobId')({
  component: ProviderJobDetail,
});
