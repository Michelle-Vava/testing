import { createFileRoute } from '@tanstack/react-router';
import { About } from '@/features/marketing/components/About';

export const Route = createFileRoute('/about')({
  component: About,
});
