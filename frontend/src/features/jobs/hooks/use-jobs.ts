import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  jobsControllerFindAll,
  jobsControllerFindOne,
  jobsControllerUpdateStatus
} from '@/api/generated/jobs/jobs';
import {
  paymentsControllerListTransactions,
  paymentsControllerCreateCharge
} from '@/api/generated/payments/payments';
import type { UpdateJobStatusDto, JobsControllerFindAllParams } from '@/api/generated/model';
import type { Job } from '@/features/jobs/types/job';

export function useJobs() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', page, limit],
    queryFn: async () => {
      const params: JobsControllerFindAllParams = {
        page,
        limit
      };
      return await jobsControllerFindAll(params);
    },
  });

  // Orval returns the response payload directly
  const responsePayload = (data as any) || {};
  const jobs = (responsePayload?.data || []) as Job[];
  const meta = responsePayload?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UpdateJobStatusDto['status'] }) =>
      jobsControllerUpdateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return {
    jobs,
    meta,
    page,
    setPage,
    limit,
    isLoading,
    error,
    updateJobStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}

export function useJob(id: string) {
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      const result = await jobsControllerFindOne(id);
      return result as unknown as Job;
    },
    enabled: !!id,
  });

  return { job, isLoading, error };
}

export function usePayments() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['payments', page, limit],
    queryFn: async () => {
      const result = await paymentsControllerListTransactions();
      return result as any;
    },
  });

  // Backend returns paginated response
  const responseData = (data as any)?.data || data;
  const payments = responseData?.data || [];
  const meta = responseData?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  const createChargeMutation = useMutation({
    mutationFn: (jobId: string) => paymentsControllerCreateCharge(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return {
    payments,
    meta,
    page,
    setPage,
    limit,
    isLoading,
    error,
    createCharge: createChargeMutation.mutate,
    isCreatingCharge: createChargeMutation.isPending,
  };
}
