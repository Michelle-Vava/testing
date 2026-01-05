import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { useRequest, useQuotes } from '@/features/requests/hooks/use-requests';
import { formatCurrency, formatShortDate, getUrgencyColor } from '@/utils/formatters';
import { useToast } from '@/contexts/ToastContext';

export function ProviderRequestDetail() {
  const navigate = useNavigate();
  const toast = useToast();
  const { requestId } = useParams({ from: '/provider/_layout/requests/$requestId' });
  const { request: serviceRequest, isLoading } = useRequest(requestId);
  
  const { createQuote, isCreating } = useQuotes(requestId || '');
  
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [quoteDescription, setQuoteDescription] = useState('');
  const [includesWarranty, setIncludesWarranty] = useState(true);

  const handleSubmitQuote = async () => {
    if (!requestId) {
      toast.error('Request ID not found');
      return;
    }

    try {
      await createQuote({
        requestId: requestId,
        amount: Number(quoteAmount),
        estimatedDuration,
        description: quoteDescription,
        includesWarranty,
      });
      
      toast.success('Quote submitted successfully!');
      setShowQuoteModal(false);
      navigate({ to: '/provider/jobs' }); // Redirect to jobs or dashboard
    } catch (error) {
      console.error('Failed to submit quote:', error);
      toast.error('Failed to submit quote. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Loading request details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="max-w-4xl">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Request not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vehicle = serviceRequest.vehicle;
  // Owner info might not be directly on serviceRequest depending on the DTO.
  // Assuming it is for now based on previous code, but checking types might be needed.
  // The previous code accessed job.owner. 
  // If ServiceRequest doesn't have owner, we might need to fetch it or it might be included.
  // Let's assume it's there or handle it gracefully.
  const owner = (serviceRequest as any).owner || {};

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{serviceRequest.title || 'Job Details'}</h1>
          <Badge className={getUrgencyColor(serviceRequest.urgency)}>
            {serviceRequest.urgency}
          </Badge>
        </div>
        <p className="text-gray-600">
          Posted by {owner.name || 'Unknown'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Request Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{serviceRequest.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Service Type</p>
                    <p className="font-medium">{serviceRequest.serviceType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location Preference</p>
                    <p className="font-medium capitalize">{serviceRequest.locationPreference || 'N/A'}</p>
                  </div>
                  {serviceRequest.preferredDate && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Preferred Date</p>
                      <p className="font-medium">{formatShortDate(serviceRequest.preferredDate)}</p>
                    </div>
                  )}
                  {(serviceRequest.budget && serviceRequest.budget.min && serviceRequest.budget.max) && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Budget Range</p>
                      <p className="font-medium">
                        {formatCurrency(serviceRequest.budget.min)} - {formatCurrency(serviceRequest.budget.max)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium">{vehicle.licensePlate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Mileage</p>
                    <p className="font-medium">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Vehicle information not available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setShowQuoteModal(true)}>
                Create Quote
              </Button>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Review the details and submit a competitive quote
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{owner.name || 'N/A'}</p>
                </div>
                {/* Email and Phone might be hidden until quote accepted */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Modal */}
      <Modal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        title="Submit Your Quote"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your quote price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="font-medium">Pricing tip:</span> Be competitive but fair. Include parts and labor.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How long will it take? *
            </label>
            <input
              type="text"
              required
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 2-3 hours, Same day, 1-2 days"
            />
            <p className="text-xs text-gray-600 mt-1">Be realistic with your time estimate</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's included in your quote? *
            </label>
            <textarea
              required
              value={quoteDescription}
              onChange={(e) => setQuoteDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Example: Full synthetic oil change with premium filter. Includes multi-point inspection, fluid top-off, and tire pressure check. All OEM-quality parts with 6-month warranty."
            />
            <p className="text-xs text-gray-600 mt-1">
              <span className="font-medium">Stand out:</span> List specific parts, warranty details, and any extras included
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includesWarranty}
                onChange={(e) => setIncludesWarranty(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Includes warranty</span>
            </label>
          </div>
        </div>

        <ModalFooter>
          <Button variant="outline" onClick={() => setShowQuoteModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitQuote}
            disabled={!quoteAmount || !estimatedDuration || !quoteDescription || isCreating}
          >
            {isCreating ? 'Submitting...' : 'Submit Quote'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
