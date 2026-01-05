import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileData {
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  mileage: number;
  mileageUnit: 'miles' | 'km';
  vin: string;
}

interface ReviewStepProps {
  profile: ProfileData;
  vehicle: VehicleData;
  isLoading: boolean;
  onBack: () => void;
  onComplete: () => void;
}

export function ReviewStep({
  profile,
  vehicle,
  isLoading,
  onBack,
  onComplete,
}: ReviewStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Complete</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Profile Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Phone: {profile.phoneNumber}</p>
              <p>
                Address: {profile.address}, {profile.city}, {profile.state}{' '}
                {profile.zipCode}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Vehicle Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              <p>Color: {vehicle.color}</p>
              <p>License Plate: {vehicle.licensePlate}</p>
              <p>Mileage: {vehicle.mileage.toLocaleString()} {vehicle.mileageUnit}</p>
              {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} fullWidth>
              Back
            </Button>
            <Button onClick={onComplete} fullWidth disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
