import { createFileRoute } from '@tanstack/react-router';
import { NewVehicleForm } from '@/features/vehicles/components/forms/NewVehicleForm';

export const Route = createFileRoute('/owner/_layout/vehicles/new')({
  component: NewVehicleForm,
});
