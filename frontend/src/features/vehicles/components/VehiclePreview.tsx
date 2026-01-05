import { Card, CardContent } from '@/components/ui/card';
import { Car } from 'lucide-react';

export interface VehiclePreviewProps {
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  licensePlate?: string;
  plate?: string; // Alias for licensePlate
  mileage?: string;
}

/**
 * Live preview card showing vehicle details as user types
 */
export function VehiclePreview({
  make = 'Your',
  model = 'Vehicle',
  year,
  color,
  licensePlate,
  plate,
  mileage,
}: VehiclePreviewProps) {
  // Use plate if licensePlate is not provided
  const displayPlate = licensePlate || plate;
  const formatMileage = (value: string): string => {
    const num = value.replace(/,/g, '');
    if (isNaN(Number(num))) return value;
    return Number(num).toLocaleString();
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500 rounded-lg">
            <Car className="w-8 h-8 text-slate-900" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {make} {model}
              {year && ` (${year})`}
            </h3>
            <div className="flex gap-4 mt-1 text-sm text-slate-300">
              {color && <span>{color}</span>}
            {displayPlate && <span>• Plate: {displayPlate}</span>}
              {mileage && <span>• {formatMileage(mileage)} km</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
