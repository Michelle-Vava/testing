import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import { VehicleCard } from './-components/vehicle-card';

export const Route = createFileRoute('/owner/_layout/vehicles/')({
  beforeLoad: () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: VehiclesPage,
});

function VehiclesPage() {
  const { vehicles, meta, page, setPage, isLoading } = useVehicles();

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Vehicles</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Vehicles</h1>
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          }
          title="No vehicles yet"
          description="Add your first vehicle to start tracking maintenance and service requests."
          action={
            <Link to="/owner/vehicles/new">
              <Button>Add Vehicle</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
        <Link to="/owner/vehicles/new">
          <Button>Add Vehicle</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle: Vehicle) => (
          <Link key={vehicle.id} to="/owner/vehicles/$vehicleId" params={{ vehicleId: vehicle.id }}>
            <VehicleCard vehicle={vehicle} />
          </Link>
        ))}
      </div>

      <Pagination meta={meta} page={page} onPageChange={setPage} />
    </div>
  );
}
