import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  requestsControllerFindAll,
  requestsControllerCreate,
  requestsControllerFindOne,
  requestsControllerUpdate
} from '@/services/generated/requests/requests';
import {
  quotesControllerFindByRequest,
  quotesControllerCreate,
  quotesControllerAccept,
  quotesControllerReject
} from '@/services/generated/quotes/quotes';
import type { CreateRequestDto, UpdateRequestDto, RequestsControllerFindAllParams } from '@/services/generated/model';
import type { ServiceRequest, Quote } from '@/features/requests/types/request';

export function useRequests(initialPage = 1, initialLimit = 20, initialStatus?: string, initialSort?: string) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);

  const { data, isLoading, error } = useQuery({
    queryKey: ['requests', page, limit, status, sort],
    queryFn: async () => {
      const params: any = {
        page,
        limit,
        status,
        sort
      };
      return await requestsControllerFindAll(params);
    },
  });

  // Backend returns { data: Request[], meta: PaginationMeta } wrapped in axios response
  // The customInstance returns the response body directly.
  // If the backend returns { data: [...], meta: {...} }, then `data` here IS that object.
  const responseData = data as any;
  const requests = (responseData?.data || []) as unknown as ServiceRequest[];
  const meta = responseData?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  const createMutation = useMutation({
    mutationFn: (requestData: CreateRequestDto) => requestsControllerCreate(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: updateData }: { id: string; data: UpdateRequestDto }) => 
      requestsControllerUpdate(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  return {
    requests,
    meta,
    page,
    setPage,
    limit,
    status,
    setStatus,
    sort,
    setSort,
    isLoading,
    error,
    createRequest: createMutation.mutateAsync,
    updateRequest: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}

export function useRequest(id: string) {
  const { data: request, isLoading, error, refetch } = useQuery({
    queryKey: ['requests', id],
    queryFn: async () => {
      const result = await requestsControllerFindOne(id);
      return result as unknown as ServiceRequest;
    },
    enabled: !!id,
  });

  return { request, isLoading, error, refetch };
}

export function useQuotes(requestId: string) {
  const queryClient = useQueryClient();

  const { data: quotes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['quotes', requestId],
    queryFn: async () => {
      const result = await quotesControllerFindByRequest(requestId);
      return result as unknown as Quote[];
    },
    enabled: !!requestId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => quotesControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (quoteId: string) => quotesControllerAccept(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (quoteId: string) => quotesControllerReject(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });

  return {
    quotes,
    isLoading,
    error,
    createQuote: createMutation.mutateAsync,
    acceptQuote: acceptMutation.mutateAsync,
    rejectQuote: rejectMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
    refetch,
  };
}
