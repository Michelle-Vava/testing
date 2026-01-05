import { createFileRoute } from '@tanstack/react-router';
import { NotFound } from '@/features/errors/components/NotFound';

export const Route = createFileRoute('/$')({
  component: NotFound,
});
