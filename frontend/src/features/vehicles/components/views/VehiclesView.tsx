import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Pagination } from '@/components/ui/pagination';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import { VehicleCard } from '../cards/VehicleCard';
import { Car } from 'lucide-react';

export function VehiclesView() {
  const { vehicles, meta, page, setPage, isLoading } = useVehicles();

  if (isLoading) {
    return (
      <PageContainer maxWidth="6xl">
        <PageHeader title="My Vehicles" />
        <LoadingState message="Loading vehicles..." />
      </PageContainer>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <PageContainer maxWidth="4xl">
        <PageHeader title="My Vehicles" />
        <EmptyState
          icon={<Car className="w-16 h-16" />}
          title="Your vehicles"
          description="Add a vehicle for faster, more accurate quotes."
          action={
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link to="/owner/vehicles/new">
                <Button>Add Vehicle</Button>
              </Link>
              <Link to="/owner/requests/new">
                <Button variant="outline">Skip for now</Button>
              </Link>
            </div>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      <PageHeader
        title="My Vehicles"
        actions={
          <Link to="/owner/vehicles/new">
            <Button>Add Vehicle</Button>
          </Link>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle: Vehicle) => (
          <Link key={vehicle.id} to="/owner/vehicles/$vehicleId" params={{ vehicleId: vehicle.id }}>
            <VehicleCard vehicle={vehicle} />
          </Link>
        ))}
      </div>

      <Pagination meta={meta} page={page} onPageChange={setPage} />
    </PageContainer>
  );
}
