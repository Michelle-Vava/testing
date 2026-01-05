import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMileage } from '@/utils/formatters';

/**
 * Props for the VehicleSpecs component.
 */
interface VehicleSpecsProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    mileage?: number;
    vin?: string;
  };
}

/**
 * Displays vehicle specifications in a card format
 */
export function VehicleSpecs({ vehicle }: VehicleSpecsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Make & Model</dt>
            <dd className="text-base text-gray-900">{vehicle.make} {vehicle.model}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Year</dt>
            <dd className="text-base text-gray-900">{vehicle.year}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Color</dt>
            <dd className="text-base text-gray-900">{vehicle.color}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">License Plate</dt>
            <dd className="text-base text-gray-900">{vehicle.licensePlate}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Current Mileage</dt>
            <dd className="text-base text-gray-900">{vehicle.mileage ? formatMileage(vehicle.mileage) : 'N/A'}</dd>
          </div>
          {vehicle.vin && (
            <div>
              <dt className="text-sm font-medium text-gray-500">VIN</dt>
              <dd className="text-sm text-gray-900 font-mono">{vehicle.vin}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
