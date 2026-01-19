import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { VehicleInfoCard } from '@/features/vehicles/components/cards/VehicleInfoCard';
import { QuoteCard } from '@/features/requests/components/cards/QuoteCard';
import { ImageGallery } from '@/features/upload/components/ImageGallery';
import { ImageUpload } from '@/features/upload/components/ImageUpload';
import { useRequest } from '@/features/requests/hooks/use-requests';
import { useQuotes } from '@/features/requests/hooks/use-requests';
import { useImageUpload } from '@/features/upload/hooks/use-image-upload';
import { formatShortDate } from '@/utils/formatters';
import { getUrgencyColor } from '@/utils/status-helpers';
import { useToast } from '@/components/ui/ToastContext';
import { Clock, ChevronLeft } from 'lucide-react';
import { RequestStatus } from '@/types/enums';

export function OwnerRequestDetail() {
  const navigate = useNavigate();
  const toast = useToast();
  // Adjusted to use regular useParams which is safer for shared components
  // or pass requestId as prop
  const { requestId } = useParams({ from: '/owner/_layout/requests/$requestId' });
  
  const { request, isLoading: requestLoading } = useRequest(requestId);
  const { quotes, isLoading: quotesLoading, acceptQuote, rejectQuote, isAccepting, isRejecting, refetch: refetchQuotes } = useQuotes(requestId!);
  const { uploadImages, deleteImage, isUploading, isDeleting } = useImageUpload();
  
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImagesSelected = async (files: File[]) => {
    try {
      await uploadImages({
        entityId: requestId!,
        entityType: 'request',
        files
      });
      // In a real app we'd refetch request to get updated images
      toast.success('Images uploaded successfully');
      setShowImageUpload(false);
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const handleAcceptQuote = async () => {
    if (!selectedQuoteId) return;
    try {
      await acceptQuote(selectedQuoteId);
      toast.success('Quote accepted!');
      setShowAcceptModal(false);
      refetchQuotes();
    } catch (error) {
      toast.error('Failed to accept quote');
    }
  };

  const handleRejectQuote = async () => {
    if (!selectedQuoteId) return;
    try {
      await rejectQuote(selectedQuoteId);
      toast.success('Quote rejected');
      setShowRejectModal(false);
      refetchQuotes();
    } catch (error) {
      toast.error('Failed to reject quote');
    }
  };

  if (requestLoading || quotesLoading) {
    return <LoadingState message="Loading request details..." />;
  }

  if (!request) {
    return <ErrorState message="Request not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          to="/owner/requests"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{request.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Posted {formatShortDate(request.createdAt)}</span>
            <span>•</span>
            <StatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
              
              {request.preferredDate && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Preferred: {formatShortDate(request.preferredDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Photos</CardTitle>
              {request.status === RequestStatus.OPEN && (
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="text-sm text-primary hover:underline"
                >
                  {showImageUpload ? 'Cancel' : 'Add Photos'}
                </button>
              )}
            </CardHeader>
            <CardContent>
              {showImageUpload && (
                <div className="mb-6">
                  <ImageUpload
                    onImagesSelected={handleImagesSelected}
                    isUploading={isUploading}
                    maxImages={5}
                  />
                </div>
              )}
              {request.images && request.images.length > 0 ? (
                <ImageGallery 
                  images={request.images} 
                  onDelete={request.status === RequestStatus.OPEN ? (id) => deleteImage(id) : undefined} 
                />
              ) : (
                <p className="text-sm text-gray-500 italic">No photos uploaded</p>
              )}
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mt-8 mb-4">Quotes ({quotes.length})</h2>
          {quotes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-gray-500">No quotes received yet.</p>
              <p className="text-sm text-gray-400 mt-1">We've notified providers in your area.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote: any) => (
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
                  isProcessing={isAccepting || isRejecting}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <VehicleInfoCard vehicle={request.vehicle} />
        </div>
      </div>

      <ConfirmationModal
        isOpen={showAcceptModal}
        title="Accept Quote"
        description="Are you sure you want to accept this quote? This will reject all other quotes and proceed to payment."
        confirmLabel="Accept & Pay"
        cancelLabel="Cancel"
        onConfirm={handleAcceptQuote}
        onCancel={() => setShowAcceptModal(false)}
        variant="default"
      />

      <ConfirmationModal
        isOpen={showRejectModal}
        title="Reject Quote"
        description="Are you sure you want to reject this quote?"
        confirmLabel="Reject"
        cancelLabel="Cancel"
        onConfirm={handleRejectQuote}
        onCancel={() => setShowRejectModal(false)}
        variant="destructive"
      />
    </div>
  );
}
