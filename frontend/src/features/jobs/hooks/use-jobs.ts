import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  jobsControllerFindAll,
  jobsControllerFindOne,
  jobsControllerUpdateStatus
} from '@/services/generated/jobs/jobs';
// Phase 1: Payment imports removed
import type { UpdateJobStatusDto, JobsControllerFindAllParams } from '@/services/generated/model';
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

// Phase 1: Payments removed - usePayments hook deprecated
// TODO: Re-implement in Phase 2 with payment integration
