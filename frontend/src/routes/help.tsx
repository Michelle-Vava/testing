import { createFileRoute } from '@tanstack/react-router';
import { Help } from '@/features/support/components/Help';

export const Route = createFileRoute('/help')({
  component: Help,
});
