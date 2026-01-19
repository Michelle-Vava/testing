import { createFileRoute } from '@tanstack/react-router';
import { VehicleDetail } from '@/features/vehicles/components/views/VehicleDetail';

export const Route = createFileRoute('/owner/_layout/vehicles/$vehicleId')({
  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { vehicleId } = Route.useParams();
  return <VehicleDetail vehicleId={vehicleId} />;
}
