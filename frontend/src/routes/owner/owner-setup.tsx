import { createFileRoute } from '@tanstack/react-router';
import { OwnerSetup } from '@/features/owner/components/OwnerSetup';

export const Route = createFileRoute('/owner/owner-setup')({
  component: OwnerSetup,
});
