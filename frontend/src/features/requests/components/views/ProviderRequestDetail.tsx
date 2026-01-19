import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRequestsControllerFindOneQueryOptions } from '@/services/generated/requests/requests';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { getUrgencyColorLight as getUrgencyColor } from '@/utils/status-helpers';
import { QuoteSubmissionModal } from '../modals/QuoteSubmissionModal';

interface ServiceRequestWithOwner {
  id: string;
  title: string;
  description?: string;
  serviceType?: string;
  urgency: string;
  locationPreference?: string;
  vehicle: any;
  owner: { name?: string };
}

export function ProviderRequestDetail() {
  const navigate = useNavigate();
  const { requestId } = useParams({ from: '/provider/_layout/requests/$requestId' });
  const { data: serviceRequest } = useSuspenseQuery<ServiceRequestWithOwner>(
    getRequestsControllerFindOneQueryOptions(requestId!)
  );
  
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  if (!serviceRequest) {
    return (
      <PageContainer maxWidth="4xl">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Request not found</p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  const vehicle = serviceRequest.vehicle;
  const owner = serviceRequest.owner || { name: 'Unknown' };

  return (
    <PageContainer maxWidth="5xl">
      <PageHeader
        title={serviceRequest.title || 'Job Details'}
        subtitle={`Posted by ${owner.name || 'Unknown'}`}
        backLink={{ to: '/provider/jobs', label: 'Back to Jobs' }}
        actions={
          <Badge className={getUrgencyColor(serviceRequest.urgency)}>
            {serviceRequest.urgency}
          </Badge>
        }
      />

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

      {/* Quote Submission Modal */}
      <QuoteSubmissionModal
        requestId={requestId!}
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        onSuccess={() => navigate({ to: '/provider/jobs' })}
      />
    </PageContainer>
  );
}
