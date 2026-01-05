import { createFileRoute } from '@tanstack/react-router';
import { Terms } from '@/features/legal/components/Terms';

export const Route = createFileRoute('/terms')({
  component: Terms,
});
