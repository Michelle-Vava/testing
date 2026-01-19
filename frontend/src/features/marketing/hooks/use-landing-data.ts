import { useRequestsControllerFindPublicRecent } from '@/services/generated/requests/requests';
import { useProvidersControllerFindFeatured } from '@/services/generated/providers/providers';
import { getUrgencyColorLight as getUrgencyColor } from '@/utils/status-helpers';

export { getUrgencyColor };

export function useLandingData() {
  // Fetch featured providers
  const { data: providersData, isLoading: providersLoading } = useProvidersControllerFindFeatured({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  });

  const providers = Array.isArray(providersData) ? providersData : [];

  // Fetch recent requests
  const { data: requestsData, isLoading: requestsLoading, error: requestsError } = useRequestsControllerFindPublicRecent({
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      select: (data) => {
        if (!Array.isArray(data)) return [];
        return data.map((req: any) => ({
          id: req.id,
          title: req.title,
          vehicle: `${req.vehicle.year} ${req.vehicle.make} ${req.vehicle.model}`,
          location: 'Nearby',
          posted: getTimeAgo(req.createdAt),
          quoteCount: req._count?.quotes || 0,
          urgency: req.urgency?.toLowerCase() || 'low',
        }));
      },
    },
  });

  const requests = requestsData || [];

  return {
    providers,
    providersLoading,
    requests,
    requestsLoading,
    requestsError,
  };
}

function getTimeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
