import { createFileRoute } from '@tanstack/react-router';
import { Landing } from '@/features/marketing/components/Landing';

export const Route = createFileRoute('/')({
  component: Landing,
});