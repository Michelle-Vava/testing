import { useParams } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useJob } from '@/features/jobs/hooks/use-jobs';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { User, Phone, Mail, Shield, CheckCircle, PlayCircle } from 'lucide-react';

export function ProviderJobDetail() {
  const { jobId } = useParams({ from: '/provider/_layout/jobs/$jobId' });
  const { job, isLoading } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Loading job details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Job not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const request = job.request;
  const vehicle = request.vehicle;
  const owner = job.owner || { name: 'N/A', email: '', phone: '' };
  const quote = job.quote;

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

  const handleStartJob = () => {
    alert('Start job functionality coming soon!');
    // Will call updateJobStatus('in_progress')
  };

  const handleCompleteJob = () => {
    alert('Complete job functionality coming soon!');
    // Will call updateJobStatus('completed')
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
          <Badge className={getStatusColor(job.status)}>
            {job.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-gray-600">
          {vehicle.year} {vehicle.make} {vehicle.model} • Job created {formatShortDate(job.createdAt)}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Customer's Request</h3>
                  <p className="text-gray-700">{request.description}</p>
                </div>

                {quote.description && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-2">Your Quote</h3>
                    <p className="text-gray-700">{quote.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Quoted Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(Number(quote.amount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estimated Duration</p>
                    <p className="font-medium">{quote.estimatedDuration}</p>
                  </div>
                </div>

                {quote.includesWarranty && (
                  <div className="flex items-center gap-2 text-green-600 pt-4 border-t">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Includes Warranty</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vehicle</p>
                  <p className="font-medium">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">License Plate</p>
                  <p className="font-medium">{vehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{vehicle.color}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mileage</p>
                  <p className="font-medium">
                    {(vehicle as any).mileage ? `${(vehicle as any).mileage.toLocaleString()} km` : 'N/A'}
                  </p>
                </div>
                {vehicle.vin && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-medium font-mono text-sm">{vehicle.vin}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Job Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Quote Accepted</p>
                    <p className="text-sm text-gray-500">{formatShortDate((job as any).createdAt)}</p>
                  </div>
                </div>

                {(job as any).startedAt && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Work Started</p>
                      <p className="text-sm text-gray-500">{formatShortDate((job as any).startedAt)}</p>
                    </div>
                  </div>
                )}

                {(job as any).completedAt && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Job Completed</p>
                      <p className="text-sm text-gray-500">{formatShortDate((job as any).completedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">{owner.name || 'Customer'}</h3>
                </div>

                <div className="space-y-2 text-sm">
                  {owner.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                  {owner.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{owner.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {owner.phone && (
                <Button fullWidth variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Actions */}
          {(job as any).status === 'pending' && (
            <Card className="border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-700">Ready to Start</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  This job has been assigned to you. Mark it as started when you begin work.
                </p>
                <Button fullWidth onClick={handleStartJob}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Job
                </Button>
              </CardContent>
            </Card>
          )}

          {job.status === 'in_progress' && (
            <Card className="border-blue-500">
              <CardHeader>
                <CardTitle className="text-blue-700">Job in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Mark this job as complete when you've finished the service.
                </p>
                <Button fullWidth onClick={handleCompleteJob}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </CardContent>
            </Card>
          )}

          {job.status === 'completed' && (
            <Card className="border-green-500">
              <CardHeader>
                <CardTitle className="text-green-700">Job Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This job has been marked as complete. Great work!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
