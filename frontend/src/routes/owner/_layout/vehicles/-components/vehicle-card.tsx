import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/features/vehicles/types/vehicle';
import { formatMileage } from '@/utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card hoverable className="h-full">
      <CardContent className="py-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {vehicle.year} {vehicle.make}
            </h3>
            <p className="text-lg text-gray-700">{vehicle.model}</p>
          </div>
          {vehicle.color && <Badge variant="default">{vehicle.color}</Badge>}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>{vehicle.licensePlate}</span>
          </div>
          {vehicle.mileage && (
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
