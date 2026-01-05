import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMileage } from '@/utils/formatters';

interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  color?: string;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
}

interface VehicleInfoCardProps {
  /** Vehicle data to display */
  vehicle: Vehicle;
  /** Optional title for the card (default: "Vehicle Information") */
  title?: string;
  /** Whether to show the card wrapper (default: true) */
  showCard?: boolean;
  /** Additional fields to display */
  className?: string;
}

/**
 * Displays vehicle information in a consistent format
 * Used across job details, request details, and vehicle management pages
 * 
 * @example
 * <VehicleInfoCard vehicle={vehicleData} />
 * 
 * @example
 * <VehicleInfoCard 
 *   vehicle={vehicleData} 
 *   title="Customer's Vehicle"
 *   showCard={false}
 * />
 */
export function VehicleInfoCard({ 
  vehicle, 
  title = 'Vehicle Information',
  showCard = true,
  className = ''
}: VehicleInfoCardProps) {
  const content = (
    <dl className="space-y-3">
      <div>
        <dt className="text-sm font-medium text-gray-500">Make & Model</dt>
        <dd className="text-base text-gray-900">
          {vehicle.make} {vehicle.model}
        </dd>
      </div>
      
      <div>
        <dt className="text-sm font-medium text-gray-500">Year</dt>
        <dd className="text-base text-gray-900">{vehicle.year}</dd>
      </div>

      {vehicle.color && (
        <div>
          <dt className="text-sm font-medium text-gray-500">Color</dt>
          <dd className="text-base text-gray-900">{vehicle.color}</dd>
        </div>
      )}

      {vehicle.licensePlate && (
        <div>
          <dt className="text-sm font-medium text-gray-500">License Plate</dt>
          <dd className="text-base text-gray-900">{vehicle.licensePlate}</dd>
        </div>
      )}

      {vehicle.mileage !== undefined && (
        <div>
          <dt className="text-sm font-medium text-gray-500">Current Mileage</dt>
          <dd className="text-base text-gray-900">{formatMileage(vehicle.mileage)}</dd>
        </div>
      )}

      {vehicle.vin && (
        <div>
          <dt className="text-sm font-medium text-gray-500">VIN</dt>
          <dd className="text-sm text-gray-900 font-mono break-all">{vehicle.vin}</dd>
        </div>
      )}
    </dl>
  );

  if (!showCard) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}

/**
 * Compact vehicle display for inline use (e.g., in headers)
 * 
 * @example
 * <VehicleInline vehicle={vehicleData} />
 * // Output: "2020 Toyota Camry"
 */
export function VehicleInline({ vehicle }: { vehicle: Vehicle }) {
  return (
    <span>
      {vehicle.year} {vehicle.make} {vehicle.model}
    </span>
  );
}
