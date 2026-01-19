import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Phone, Mail } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

/**
 * Props for the JobStatusBanner component.
 */
interface JobStatusBannerProps {
  status: string;
  providerName: string;
  providerPhone: string;
  providerEmail: string;
  quoteAmount: number;
}

export function JobStatusBanner({ 
  status, 
  providerName, 
  providerPhone, 
  providerEmail,
  quoteAmount 
}: JobStatusBannerProps) {
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

  if (status !== 'pending') {
    return (
      <Badge className={getStatusColor(status)}>
        {status.replace('_', ' ')}
      </Badge>
    );
  }

  return (
    <AlertBox variant="success" className="border-2 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-green-900 mb-2">Your job is confirmed!</h2>
          <p className="text-green-800 mb-4">
            {providerName} has been notified and will contact you within 24 hours to schedule your service.
          </p>
          
          <div className="bg-white rounded-lg p-4 space-y-3 border border-green-100">
            <p className="font-semibold text-gray-900">What happens next:</p>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Mechanic reaches out</p>
                <p className="text-sm text-gray-600">You'll receive a call or text to schedule a convenient time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Service appointment</p>
                <p className="text-sm text-gray-600">Bring your vehicle in at the scheduled time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Work completed</p>
                <p className="text-sm text-gray-600">Pay {formatCurrency(quoteAmount)} and get back on the road</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <a href={`tel:${providerPhone}`} className="flex-1">
              <Button fullWidth variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                <Phone className="w-4 h-4 mr-2" />
                Call {providerName}
              </Button>
            </a>
            <a href={`mailto:${providerEmail}`} className="flex-1">
              <Button fullWidth variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                <Mail className="w-4 h-4 mr-2" />
                Email Mechanic
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
