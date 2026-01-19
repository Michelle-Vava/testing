import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertBox } from '@/components/ui/alert-box';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from '@tanstack/react-router';
import { Loader2, MapPin, Calendar, DollarSign, User, Car, MessageSquare, Star, CheckCircle } from 'lucide-react';
// Phase 1: Payments and Reviews removed - coming in Phase 2

interface JobDetailsViewProps {
  job: any;
  isLoading: boolean;
  error: any;
  onConfirmCompletion?: () => void;
  isConfirming?: boolean;
}

export function JobDetailsView({ job, isLoading, error, onConfirmCompletion, isConfirming }: JobDetailsViewProps) {
  // Phase 1: Removed payment and review state

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900">Job not found</h3>
        <p className="text-gray-500">The job you are looking for does not exist or you don't have permission to view it.</p>
      </div>
    );
  }

  const isCompleted = job.status === 'completed';
  const isPendingConfirmation = job.status === 'pending_confirmation';
  // Phase 1: Payment and review functionality removed

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.request.title}</h1>
          <p className="text-gray-500">Job ID: {job.id}</p>
        </div>
        <Badge variant={isCompleted ? "default" : "outline"} className="text-sm px-3 py-1">
          {job.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">{job.request.description}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Started: {job.startedAt ? new Date(job.startedAt).toLocaleDateString() : 'Not started'}</span>
              </div>
              {job.completedAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Completed: {new Date(job.completedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Car className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {job.request.vehicle.year} {job.request.vehicle.make} {job.request.vehicle.model}
                  </h4>
                  <p className="text-sm text-gray-500">VIN: {job.request.vehicle.vin || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Mileage: {job.request.vehicle.mileage?.toLocaleString() || 'N/A'} miles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{job.provider.name}</p>
                  <p className="text-sm text-gray-500">Service Provider</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{job.provider.city || 'Location N/A'}</span>
                </div>
              </div>
              
              <Link to="/messages" search={{ jobId: job.id }} className="block mt-4">
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.quote.laborCost !== null && job.quote.partsCost !== null && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Labor</span>
                    <span className="font-medium">${Number(job.quote.laborCost).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Parts</span>
                    <span className="font-medium">${Number(job.quote.partsCost).toFixed(2)}</span>
                  </div>
                  <Separator />
                </>
              )}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${Number(job.quote.amount).toFixed(2)}</span>
              </div>

              {/* Owner Confirmation Button (Phase 1) */}
              {isPendingConfirmation && onConfirmCompletion && (
                <div className="mt-4 pt-4 border-t">
                  <AlertBox variant="purple" className="mb-3">
                    <p className="text-sm font-medium mb-1">Work Complete!</p>
                    <p className="text-xs">The provider has finished the work. Please confirm completion.</p>
                  </AlertBox>
                  <Button 
                    onClick={onConfirmCompletion}
                    disabled={isConfirming}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Work Done
                      </>
                    )}
                  </Button>
                </div>
              )}

              {isCompleted && (
                <div className="mt-4 pt-4 border-t">
                  <AlertBox variant="success" icon={<CheckCircle className="w-5 h-5" />}>
                    <div>
                      <p className="font-medium">Work Confirmed</p>
                      <p className="text-xs mt-1">You confirmed this job was completed successfully.</p>
                    </div>
                  </AlertBox>
                </div>
              )}

              {/* Phase 1: Payment and Review sections removed - coming in Phase 2 */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
