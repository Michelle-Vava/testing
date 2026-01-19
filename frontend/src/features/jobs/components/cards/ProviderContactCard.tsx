import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Phone, Mail } from 'lucide-react';

interface ProviderContactCardProps {
  status: string;
  providerName: string;
  providerPhone: string;
  providerEmail: string;
}

export function ProviderContactCard({ 
  status, 
  providerName, 
  providerPhone, 
  providerEmail 
}: ProviderContactCardProps) {
  return (
    <div className="space-y-6">
      {/* Provider Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Your Mechanic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">{providerName}</h3>
            </div>

            <div className="space-y-2 text-sm">
              <a
                href={`tel:${providerPhone}`}
                className="flex items-center gap-2 text-gray-700 hover:text-yellow-600"
              >
                <Phone className="w-4 h-4" />
                <span>{providerPhone}</span>
              </a>
              <a
                href={`mailto:${providerEmail}`}
                className="flex items-center gap-2 text-gray-700 hover:text-yellow-600"
              >
                <Mail className="w-4 h-4" />
                <span>{providerEmail}</span>
              </a>
            </div>
          </div>

          <Button fullWidth variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Call Provider
          </Button>
        </CardContent>
      </Card>

      {/* Status-specific Cards */}
      {status === 'completed' && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700">Job Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              This job has been marked as complete. If you have any issues, please contact the provider.
            </p>
            <Button fullWidth>Leave Review (Coming Soon)</Button>
          </CardContent>
        </Card>
      )}

      {status === 'in_progress' && (
        <Card>
          <CardHeader>
            <CardTitle>Job in Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Your service is currently being performed. The provider will notify you when complete.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
