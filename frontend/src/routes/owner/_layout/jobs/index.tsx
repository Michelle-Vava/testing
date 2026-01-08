import { createFileRoute } from '@tanstack/react-router';
import { OwnerJobsList } from '@/features/jobs/components/OwnerJobsList';

export const Route = createFileRoute('/owner/_layout/jobs/')({
  component: OwnerJobsList,
});
