import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { VehicleInfoCard } from '@/features/vehicles/components/VehicleInfoCard';
import { QuoteCard } from '@/features/requests/components/QuoteCard';
import { ImageGallery } from '@/features/upload/components/ImageGallery';
import { ImageUpload } from '@/features/upload/components/ImageUpload';
import { useRequest } from '@/features/requests/hooks/use-requests';
import { useQuotes } from '@/features/requests/hooks/use-requests';
import { useImageUpload } from '@/hooks/use-image-upload';
import { formatShortDate } from '@/utils/formatters';
import { getUrgencyColor } from '@/shared/utils/status-helpers';
import { useToast } from '@/contexts/ToastContext';
import { Clock, ChevronLeft } from 'lucide-react';

export const Route = createFileRoute('/owner/_layout/requests/$requestId')({
  component: RequestDetailPage,
});

/**
 * Displays detailed view of a service request with quotes
 * 
 * Features:
 * - Request details and vehicle information
 * - List of quotes from providers
 * - Accept/reject quote actions
 * - Real-time status updates
 */
function RequestDetailPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { requestId } = Route.useParams();
  const { request, isLoading: requestLoading } = useRequest(requestId);
  const { quotes, isLoading: quotesLoading, acceptQuote, rejectQuote, isAccepting, isRejecting, refetch: refetchQuotes } = useQuotes(requestId);
  const { uploadImages, deleteImage, isUploading, isDeleting } = useImageUpload();
  
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImagesSelected = async (files: File[]) => {
    try {
      await uploadImages({
        entityId: requestId,
        entityType: 'request',
        files,
      });
      setShowImageUpload(false);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleImageRemove = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      await deleteImage({
        entityId: requestId,
        entityType: 'request',
        imageUrl,
      });
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  // Show loading state while fetching data
  if (requestLoading || quotesLoading) {
    return <LoadingState message="Loading request details..." />;
  }

  // Show error state if request not found
  if (!request) {
    return (
      <ErrorState
        title="Request Not Found"
        message="The service request you're looking for doesn't exist or has been removed."
      />
    );
  }

  /** Handle accepting a quote and creating a job */
  const handleAcceptQuote = async () => {
    if (!selectedQuoteId) return;
    
    try {
      await acceptQuote(selectedQuoteId);
      toast.success('Quote accepted! Your job has been scheduled.');
      setShowAcceptModal(false);
      navigate({ to: '/owner/jobs' });
    } catch (error) {
      console.error('Failed to accept quote:', error);
      toast.error('Failed to accept quote. Please try again.');
    }
  };

  /** Handle rejecting a quote */
  const handleRejectQuote = async () => {
    if (!selectedQuoteId) return;
    
    try {
      await rejectQuote(selectedQuoteId);
      toast.success('Quote rejected');
      setShowRejectModal(false);
      setSelectedQuoteId(null);
    } catch (error) {
      console.error('Failed to reject quote:', error);
      toast.error('Failed to reject quote. Please try again.');
    }
  };

  const vehicle = request.vehicle;
  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const acceptedQuote = quotes.find(q => q.status === 'accepted');
  
  // Sort quotes: pending first (sorted by price), then accepted, then rejected
  const sortedQuotes = [...quotes].sort((a, b) => {
    // Status priority: pending > accepted > rejected
    const statusOrder: Record<string, number> = { 'pending': 0, 'accepted': 1, 'rejected': 2 };
    const statusDiff = (statusOrder[a.status] || 3) - (statusOrder[b.status] || 3);
    if (statusDiff !== 0) return statusDiff;
    
    // Within same status, sort by price (lowest first)
    return Number(a.amount) - Number(b.amount);
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/owner/requests" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Service Requests
        </Link>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Link to="/owner/requests" className="hover:text-gray-900">Service Requests</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{request.title}</span>
        </div>
      </div>

      {/* Request Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
          <Badge className={getUrgencyColor(request.urgency)}>
            {request.urgency}
          </Badge>
          <StatusBadge status={request.status} type="request" />
        </div>
        <p className="text-gray-600">
          {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} • ` : ''}Posted {formatShortDate(request.createdAt)}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{request.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Photos</CardTitle>
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showImageUpload ? 'Cancel' : 'Add Photos'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {showImageUpload && (
                <div className="mb-6">
                  <ImageUpload
                    images={request.imageUrls || []}
                    onImagesSelected={handleImagesSelected}
                    onImageRemove={handleImageRemove}
                    maxImages={10}
                    isLoading={isUploading || isDeleting}
                  />
                </div>
              )}
              
              {request.imageUrls && request.imageUrls.length > 0 ? (
                <ImageGallery
                  images={request.imageUrls}
                  alt={request.title}
                />
              ) : (
                !showImageUpload && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">No photos yet</p>
                    <button
                      onClick={() => setShowImageUpload(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add photos to help providers understand the issue
                    </button>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Quotes Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quotes Received</CardTitle>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      refetchQuotes();
                      toast.success('Quotes refreshed');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Refresh
                  </button>
                  <Badge>{quotes.length} total</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {quotes.length === 0 ? (
                <EmptyQuotesState />
              ) : (
                <div className="space-y-4">
                  {pendingQuotes.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-900 font-medium">
                        💡 Tip: Quotes are sorted by price (lowest first). Compare features and reviews before deciding.
                      </p>
                    </div>
                  )}
                  {sortedQuotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      onAccept={() => {
                        setSelectedQuoteId(quote.id);
                        setShowAcceptModal(true);
                      }}
                      onReject={() => {
                        setSelectedQuoteId(quote.id);
                        setShowRejectModal(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Tip */}
          {pendingQuotes.length > 0 && !acceptedQuote && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-900">
                  Review the quotes and accept the one that best fits your needs. 
                  Once accepted, we'll connect you with the provider to schedule your service.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Vehicle Info */}
        <div className="space-y-6">
          {vehicle && <VehicleInfoCard vehicle={vehicle} title="Vehicle" />}
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        isOpen={showAcceptModal}
        onClose={() => !isAccepting && setShowAcceptModal(false)}
        onConfirm={handleAcceptQuote}
        title="Accept This Quote?"
        confirmText="Confirm & Book"
        isLoading={isAccepting}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This will create a confirmed job with the provider. Here's what happens:
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-900">The provider will be notified immediately</p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-900">They'll contact you to schedule the service</p>
            </div>
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-900">Other quotes will be automatically declined</p>
            </div>
          </div>
        </div>
      </ConfirmationModal>

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleRejectQuote}
        title="Decline Quote?"
        confirmText="Yes, Decline"
        confirmVariant="danger"
        isLoading={isRejecting}
      >
        <p className="text-gray-700">
          Are you sure you want to decline this quote? This action cannot be undone.
        </p>
      </ConfirmationModal>
    </div>
  );
}

/**
 * Empty state shown when no quotes have been received yet
 */
function EmptyQuotesState() {
  return (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
        <Clock className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Quotes on the way</h3>
      <p className="text-gray-600 mb-1">
        Your request has been sent to verified providers in your area
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Quotes typically arrive within 2-4 hours during business hours
      </p>
      <div className="inline-flex items-start gap-3 text-left bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md">
        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="text-sm">
          <p className="font-medium text-gray-900 mb-1">What happens next:</p>
          <ul className="text-gray-600 space-y-1">
            <li>• Providers review your request</li>
            <li>• Quotes appear here as they arrive</li>
            <li>• You'll get a notification for each quote</li>
            <li>• Compare and choose the best fit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

