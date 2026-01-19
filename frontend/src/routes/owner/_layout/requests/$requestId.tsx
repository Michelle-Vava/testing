import { createFileRoute } from '@tanstack/react-router';
import { OwnerRequestDetail } from '@/features/requests/components/views/OwnerRequestDetail';

export const Route = createFileRoute('/owner/_layout/requests/$requestId')({
  component: OwnerRequestDetail,
});

