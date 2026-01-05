import { Link } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceRequest } from '@/features/requests/types/request';
import { Vehicle } from '@/features/vehicles/types/vehicle';
import { formatShortDate, getStatusColor } from '@/utils/formatters';

interface RequestCardProps {
  request: ServiceRequest;
  vehicle?: Vehicle;
}

export function RequestCard({ request, vehicle }: RequestCardProps) {
  return (
    <Card hoverable>
      <CardContent className="py-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
              <Badge className={getStatusColor(request.status)}>
                {request.status.replace('_', ' ')}
              </Badge>
              {request.urgency === 'high' && <Badge variant="danger">Urgent</Badge>}
            </div>
            {vehicle && (
              <p className="text-sm text-gray-600 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
              </p>
            )}
            <p className="text-gray-700 mb-3">{request.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>Posted {formatShortDate(request.createdAt)}</span>
          </div>
          <div className="flex gap-2">
            <Link to="/owner/requests/$requestId" params={{ requestId: request.id }}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
