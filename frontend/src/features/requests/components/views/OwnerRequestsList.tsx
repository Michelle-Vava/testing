import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useInfiniteRequests } from '@/features/requests/hooks/use-infinite-requests';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import type { ServiceRequest } from '@/features/requests/types/request';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import { RequestCard } from '../cards/RequestCard';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';

const routeApi = getRouteApi('/owner/_layout/requests/');

export function OwnerRequestsList() {
  const search = routeApi.useSearch();
  const navigate = useNavigate({ from: '/owner/_layout/requests/' });
  
  const { 
    data, 
    isLoading: requestsLoading, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteRequests(20, search.status, search.sort);

  const { vehicles } = useVehicles();

  const flatRequests = data?.pages.flatMap((page: any) => page.data || []) || [];
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: flatRequests.length,
    estimateSize: () => 300,
    overscan: 5,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();
    if (!lastItem) return;

    if (
      lastItem.index >= flatRequests.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, flatRequests.length, isFetchingNextPage, virtualItems]);

  const handleStatusChange = (newStatus: string) => {
    const s = newStatus === 'all' ? undefined : newStatus;
    navigate({ search: (prev) => ({ ...prev, status: s, page: 1 }) });
  };

  const handleSortChange = (newSort: string) => {
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

  if (flatRequests.length === 0) {
    return (
      <PageContainer maxWidth="4xl">
        <PageHeader title="Service Requests" />
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="Post your first request"
          description="Describe the issue and get quotes from providers near you. What you'll need (30 seconds): issue description, preferred time, location."
          action={
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Button onClick={() => navigate({ to: '/owner/requests/new' })}>
                Create Request
              </Button>
              {(!vehicles || vehicles.length === 0) && (
                <Button 
                  onClick={() => navigate({ to: '/owner/vehicles/new' })}
                  variant="outline"
                >
                  Add Vehicle (optional)
                </Button>
              )}
            </div>
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
                (search.status === s || (!search.status && s === 'all'))
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
            value={search.sort || 'newest'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="urgency">Urgency</option>
          </select>
        </div>
      </div>

      <div ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => {
            const request = flatRequests[virtualItem.index];
            const vehicle = vehicles.find((v: Vehicle) => v.id === request.vehicleId);
             // Ensure request exists
            if (!request) return null;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                 <div className="pb-4">
                    <RequestCard request={request} vehicle={vehicle} />
                 </div>
              </div>
            );
          })}
        </div>
      </div>
       
      {isFetchingNextPage && (
          <div className="py-4 text-center text-sm text-gray-500">
             Loading more...
          </div>
      )}
    </PageContainer>
  );
}
