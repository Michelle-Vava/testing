import { createFileRoute } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/contexts/ToastContext';
import { useJobsControllerFindOne } from '@/api/generated/jobs/jobs';
import { useReviewsControllerFindByJob } from '@/api/generated/reviews/reviews';
import { useReviewsControllerCreate } from '@/api/generated/reviews/reviews';
import { JobDetailsView } from '@/features/jobs/components/JobDetailsView';

export const Route = createFileRoute('/owner/_layout/jobs/$jobId')({
  component: JobDetails,
});

function JobDetails() {
  const { jobId } = Route.useParams();
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: job, isLoading, error } = useJobsControllerFindOne(jobId);

  const { data: review } = useReviewsControllerFindByJob(jobId, {
    query: { enabled: !!job && job.status === 'completed' },
  });

  const { mutate: createReview } = useReviewsControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'job', jobId] });
        queryClient.invalidateQueries({ queryKey: ['jobs', jobId] });
        toast.success('Review submitted successfully!');
      },
      onError: () => {
        toast.error('Failed to submit review. Please try again.');
      },
    },
  });

  const handleCreateReview = (data: { rating: number; comment: string }) => {
    createReview({ data: { jobId, ...data } });
  };

  return (
    <JobDetailsView
      job={job}
      review={review}
      isLoading={isLoading}
      error={error}
      onCreateReview={handleCreateReview}
    />
  );
}
