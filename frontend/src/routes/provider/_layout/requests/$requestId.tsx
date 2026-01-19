import { createFileRoute } from '@tanstack/react-router';
import { ProviderRequestDetail } from '@/features/requests/components/views/ProviderRequestDetail';
import { getRequestsControllerFindOneQueryOptions } from '@/services/generated/requests/requests';
import { queryClient } from '@/lib/react-query';

export const Route = createFileRoute('/provider/_layout/requests/$requestId')({
  loader: ({ params: { requestId } }) => 
    queryClient.ensureQueryData(getRequestsControllerFindOneQueryOptions(requestId)),
  component: ProviderRequestDetail,
});
