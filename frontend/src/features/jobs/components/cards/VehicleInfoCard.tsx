import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Props for the VehicleInfoCard component.
 */
interface VehicleInfoCardProps {
  year: number;
  make: string;
  model: string;
  licensePlate: string;
  color: string;
  mileage?: number;
}

export function VehicleInfoCard({ 
  year, 
  make, 
  model, 
  licensePlate, 
  color, 
  mileage 
}: VehicleInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium">
              {year} {make} {model}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">License Plate</p>
            <p className="font-medium">{licensePlate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Color</p>
            <p className="font-medium">{color}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mileage</p>
            <p className="font-medium">
              {mileage ? `${mileage.toLocaleString()} km` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
