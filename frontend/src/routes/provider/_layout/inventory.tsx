import { createFileRoute } from '@tanstack/react-router';
import { PartsInventoryView } from '@/features/parts/components/PartsInventoryView';

export const Route = createFileRoute('/provider/_layout/inventory')({
  component: PartsInventoryView,
});
