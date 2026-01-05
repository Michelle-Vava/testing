import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { useJobs } from '@/features/jobs/hooks/use-jobs';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Calendar, Wrench } from 'lucide-react';

export const Route = createFileRoute('/owner/_layout/jobs/')({
  beforeLoad: () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: JobsPage,
});

function JobsPage() {
  const { jobs, meta, page, setPage, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Jobs</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Jobs</h1>
        <EmptyState
          icon={<Wrench className="w-16 h-16" />}
          title="No jobs yet"
          description="Once you accept a quote, your scheduled jobs will appear here."
          action={
            <Link to="/owner/requests">
              <Button>View Service Requests</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <Link to="/owner/requests/new" search={{ serviceType: undefined, providerId: undefined }}>
          <Button>Request New Service</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {jobs.map((job: any) => {
          const request = job.request || {};
          const vehicle = request.vehicle || {};
          const provider = job.provider || {};
          const quote = job.quote || {};

          return (
            <Link key={job.id} to="/owner/jobs/$jobId" params={{ jobId: job.id }}>
              <Card hoverable>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{request.title || 'Service Job'}</CardTitle>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(Number(quote.amount))}
                      </p>
                      <p className="text-sm text-gray-500">{quote.estimatedDuration}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        <span>{provider.name}</span>
                      </div>
                      {job.startedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Started {formatShortDate(job.startedAt)}</span>
                        </div>
                      )}
                      {job.completedAt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Completed {formatShortDate(job.completedAt)}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Pagination meta={meta} page={page} onPageChange={setPage} />
    </div>
  );
}
