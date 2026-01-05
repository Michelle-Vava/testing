import { createFileRoute, redirect } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useRequests } from '@/features/requests/hooks/use-requests';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import type { ServiceRequest } from '@/features/requests/types/request';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import { RequestCard } from './-components/request-card';

export const Route = createFileRoute('/owner/_layout/requests/')({
  beforeLoad: () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: RequestsPage,
});

function RequestsPage() {
  const { requests, meta, page, setPage, isLoading: requestsLoading } = useRequests();
  const { vehicles } = useVehicles();

  if (requestsLoading) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Requests</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Requests</h1>
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="Ready to get quotes?"
          description={(vehicles && vehicles.length > 0)
            ? "Create your first service request and start receiving competitive quotes from verified mechanics."
            : "Add a vehicle first, then create a service request to get quotes from verified mechanics."}
          action={
            (vehicles && vehicles.length > 0) ? (
              <Button onClick={() => window.location.href = '/owner/requests/new'}>
                Create Service Request
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/owner/vehicles/new'}>
                Add Vehicle First
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
        <Button onClick={() => window.location.href = '/owner/requests/new'}>
          New Request
        </Button>
      </div>

      <div className="space-y-4">
        {requests.map((request: ServiceRequest) => {
          const vehicle = vehicles.find((v: Vehicle) => v.id === request.vehicleId);
          return <RequestCard key={request.id} request={request} vehicle={vehicle} />;
        })}
      </div>

      <Pagination meta={meta} page={page} onPageChange={setPage} />
    </div>
  );
}
