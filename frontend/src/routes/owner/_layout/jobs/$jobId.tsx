import { createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/ToastContext';
import { useJobsControllerFindOne, useJobsControllerUpdateStatus } from '@/services/generated/jobs/jobs';
// Phase 1: Review imports removed
import { JobDetailsView } from '@/features/jobs/components/views/JobDetailsView';

export const Route = createFileRoute('/owner/_layout/jobs/$jobId')({
  component: JobDetails,
});

function JobDetails() {
  const { jobId } = Route.useParams();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: job, isLoading, error } = useJobsControllerFindOne(jobId);
  const { mutate: updateJobStatus, isPending: isConfirming } = useJobsControllerUpdateStatus({
    mutation: {
      onSuccess: () => {
        toast.success('Work confirmed! Thank you for using our service.');
        queryClient.invalidateQueries({ queryKey: ['jobsControllerFindOne', jobId] });
        queryClient.invalidateQueries({ queryKey: ['jobsControllerFindAll'] });
      },
      onError: (error) => {
        console.error('Failed to confirm completion:', error);
        toast.error('Failed to confirm work completion. Please try again.');
      },
    },
  });

  const handleConfirmCompletion = () => {
    updateJobStatus({
      id: jobId,
      data: { status: 'completed' },
    });
  };

  // Phase 1: Review functionality removed

  return (
    <JobDetailsView
      job={job}
      isLoading={isLoading}
      error={error}
      onConfirmCompletion={handleConfirmCompletion}
      isConfirming={isConfirming}
    />
  );
}
