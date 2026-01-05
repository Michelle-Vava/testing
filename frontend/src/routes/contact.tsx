import { createFileRoute } from '@tanstack/react-router';
import { Contact } from '@/features/support/components/Contact';

export const Route = createFileRoute('/contact')({
  component: Contact,
});
