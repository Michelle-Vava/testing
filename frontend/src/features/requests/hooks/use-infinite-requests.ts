import { useInfiniteQuery } from '@tanstack/react-query';
import { requestsControllerFindAll } from '@/services/generated/requests/requests';
import type { ServiceRequest } from '@/features/requests/types/request';

export function useInfiniteRequests(limit = 20, status?: string, sort?: string) {
  return useInfiniteQuery({
    queryKey: ['requests', 'infinite', limit, status, sort],
    queryFn: async ({ pageParam = 1 }) => {
      const params: any = {
        page: pageParam,
        limit,
        status,
        sort
      };
      const response = await requestsControllerFindAll(params);
      // Ensure we access the data property if the response is wrapped
      // Based on useRequests, response might be the object directly or axios response
      // useRequests says: const responseData = data as any; const requests = (responseData?.data || []) ...
      
      // We need to return the full object structure to extract meta for getNextPageParam
      return response as any;
    },
    getNextPageParam: (lastPage) => {
      // access response.meta
      const meta = lastPage?.meta;
      if (!meta) return undefined;
      
      if (meta.page < meta.totalPages) {
        return meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
