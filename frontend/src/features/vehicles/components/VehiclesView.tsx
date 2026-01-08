import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import { VehicleCard } from './VehicleCard';
import { Car } from 'lucide-react';

export function VehiclesView() {
  const { vehicles, meta, page, setPage, isLoading } = useVehicles();

  if (isLoading) {
    return (
      <PageContainer maxWidth="6xl">
        <PageHeader title="My Vehicles" />
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          <p className="mt-2 text-slate-600">Loading vehicles...</p>
        </div>
      </PageContainer>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <PageContainer maxWidth="4xl">
        <PageHeader title="My Vehicles" />
        <EmptyState
          icon={<Car className="w-16 h-16" />}
          title="No vehicles yet"
          description="Add your first vehicle to start tracking maintenance and service requests."
          action={
            <Link to="/owner/vehicles/new">
              <Button>Add Vehicle</Button>
            </Link>
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
