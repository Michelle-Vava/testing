import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJobs } from '@/features/jobs/hooks/use-jobs';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { Calendar, Car, User, Clock, Phone, Mail } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';

export function ProviderJobsList() {
  const { jobs, meta, isLoading } = useJobs();

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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Loading your jobs...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
          <p className="text-gray-600">Manage your scheduled and active service jobs</p>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <EmptyState
          icon={<Car className="w-12 h-12" />}
          title="No jobs yet"
          description="When customers accept your quotes, jobs will appear here."
          action={
            <Link to="/provider/dashboard">
              <Button>View Dashboard</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {jobs.map((job) => {
              const request = job.request;
              const vehicle = request.vehicle;
              const owner = request.owner || { name: 'N/A', email: '', phone: '' };
              const quote = job.quote;

              return (
                <Link
                  key={job.id}
                  to="/provider/jobs/$jobId"
                  params={{ jobId: job.id }}
                  className="block"
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{request.title}</CardTitle>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Car className="w-4 h-4" />
                            <span>
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                            {vehicle.licensePlate && (
                              <>
                                <span>•</span>
                                <span>{vehicle.licensePlate}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(Number(quote.amount))}
                          </p>
                          <p className="text-sm text-gray-500">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {quote.estimatedDuration}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Customer Info */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Customer</p>
                              <p className="text-sm text-gray-600">{owner.name}</p>
                              {owner.phone && (
                                <a
                                  href={`tel:${owner.phone}`}
                                  className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1 mt-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Phone className="w-3 h-3" />
                                  {owner.phone}
                                </a>
                              )}
                              {owner.email && (
                                <a
                                  href={`mailto:${owner.email}`}
                                  className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-1 mt-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail className="w-3 h-3" />
                                  {owner.email}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Job Timeline */}
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Timeline</p>
                              <p className="text-sm text-gray-600">
                                Accepted: {formatShortDate((job as any).createdAt)}
                              </p>
                              {(job as any).startedAt && (
                                <p className="text-sm text-gray-600">
                                  Started: {formatShortDate((job as any).startedAt)}
                                </p>
                              )}
                              {(job as any).completedAt && (
                                <p className="text-sm text-green-600">
                                  Completed: {formatShortDate((job as any).completedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Service Description Preview */}
                      {request.description && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {request.description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                meta={meta}
                page={meta.currentPage}
                onPageChange={(page) => {
                  // Handle page change
                  console.log('Page changed to:', page);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
