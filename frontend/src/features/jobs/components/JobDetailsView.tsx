import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from '@tanstack/react-router';
import { Loader2, MapPin, Calendar, DollarSign, User, Car, MessageSquare, Star, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { PaymentModal } from '@/features/payments/components/PaymentModal';
import { ReviewForm } from '@/features/reviews/components/ReviewForm';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';

interface JobDetailsViewProps {
  job: any;
  review?: any;
  isLoading: boolean;
  error: any;
  onCreateReview: (data: { rating: number; comment: string }) => void;
}

export function JobDetailsView({ job, review, isLoading, error, onCreateReview }: JobDetailsViewProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

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
  const isPaid = job.payments && job.payments.length > 0 && job.payments.some((p: any) => p.status === 'completed');
  const canPay = isCompleted && !isPaid;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.request.title}</h1>
          <p className="text-gray-500">Job ID: {job.id}</p>
        </div>
        <Badge variant={isCompleted ? (isPaid ? "default" : "secondary") : "outline"} className="text-sm px-3 py-1">
          {isPaid ? 'Paid' : job.status.replace('_', ' ')}
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
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Service Quote</span>
                <span className="font-medium">${Number(job.quote.amount).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${Number(job.quote.amount).toFixed(2)}</span>
              </div>

              {canPay && (
                <Button className="w-full mt-4" onClick={() => setIsPaymentModalOpen(true)}>
                  Pay Now
                </Button>
              )}
              
              {isPaid && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center text-sm font-medium">
                  Payment Completed
                </div>
              )}

              {/* Review Section */}
              {isCompleted && !review && !showReviewForm && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(true)}
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Leave a Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Section */}
      {isCompleted && (
        <div className="mt-6">
          {showReviewForm ? (
            <ReviewForm
              jobId={job.id}
              providerName={job.provider.name}
              onSubmit={(data) => {
                onCreateReview(data);
                setShowReviewForm(false);
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          ) : review ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewCard review={review} />
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        jobId={job.id}
        amount={Number(job.quote.amount)}
      />
    </div>
  );
}
