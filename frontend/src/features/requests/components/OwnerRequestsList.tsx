import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useRequests } from '@/features/requests/hooks/use-requests';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import type { ServiceRequest } from '@/features/requests/types/request';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import { RequestCard } from './RequestCard';

const routeApi = getRouteApi('/owner/_layout/requests/');

export function OwnerRequestsList() {
  const search = routeApi.useSearch();
  const navigate = useNavigate({ from: '/owner/_layout/requests/' });
  const { requests, meta, page, setPage, status, setStatus, sort, setSort, isLoading: requestsLoading, error } = useRequests(search.page, 20, search.status, search.sort);
  const { vehicles } = useVehicles();

  const handleStatusChange = (newStatus: string) => {
    const s = newStatus === 'all' ? undefined : newStatus;
    setStatus(s);
    navigate({ search: (prev) => ({ ...prev, status: s, page: 1 }) });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    navigate({ search: (prev) => ({ ...prev, sort: newSort, page: 1 }) });
  };

  if (requestsLoading) {
    return (
      <PageContainer maxWidth="5xl">
        <LoadingState message="Loading requests..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer maxWidth="5xl">
        <ErrorState title="Failed to load requests" message="Please try again later." />
      </PageContainer>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <PageContainer maxWidth="4xl">
        <PageHeader title="Service Requests" />
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="Ready to get quotes?"
          description={(vehicles && vehicles.length > 0)
            ? "Create your first service request and start receiving competitive quotes from verified providers."
            : "Add a vehicle first, then create a service request to get quotes from verified providers."}
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
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title="Service Requests"
        actions={
          <Button onClick={() => navigate({ to: '/owner/requests/new' })}>
            New Request
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'open', 'quoted', 'in_progress', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (status === s || (!status && s === 'all'))
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <div className="sm:ml-auto">
          <select
            aria-label="Sort requests by date"
            value={sort || 'newest'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="urgency">Urgency</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {requests.map((request: ServiceRequest) => {
          const vehicle = vehicles.find((v: Vehicle) => v.id === request.vehicleId);
          return <RequestCard key={request.id} request={request} vehicle={vehicle} />;
        })}
      </div>

      <Pagination meta={meta} page={page} onPageChange={setPage} />
    </PageContainer>
  );
}
