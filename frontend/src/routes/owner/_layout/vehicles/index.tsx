import { createFileRoute, redirect } from '@tanstack/react-router';
import { VehiclesView } from '@/features/vehicles/components/VehiclesView';

export const Route = createFileRoute('/owner/_layout/vehicles/')({
  component: VehiclesView,
});
