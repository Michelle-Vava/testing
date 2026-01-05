import { createFileRoute } from '@tanstack/react-router';
import { OwnerDashboard } from '@/features/owner/components/OwnerDashboard';

export const Route = createFileRoute('/owner/_layout/dashboard')({
  component: OwnerDashboard,
});
