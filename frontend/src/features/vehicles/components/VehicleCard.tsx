import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Vehicle } from '@/features/vehicles/types/vehicle';
import { formatMileage } from '@/utils/formatters';
import { Tag, Gauge } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card hoverable className="h-full">
      <CardContent className="py-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              {vehicle.year} {vehicle.make}
            </h3>
            <p className="text-lg text-slate-700">{vehicle.model}</p>
          </div>
          {vehicle.color && <Badge variant="default">{vehicle.color}</Badge>}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Tag className="w-4 h-4" />
            <span>{vehicle.licensePlate}</span>
          </div>
          {vehicle.mileage && (
            <div className="flex items-center gap-2 text-slate-600">
              <Gauge className="w-4 h-4" />
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
