import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  vehicleId: string;
  currentMileage?: number;
  onCreateRequest: () => void;
  onUpdateMileage: () => void;
  onAddMaintenance: () => void;
  onEditVehicle: () => void;
}

/**
 * Quick action buttons for vehicle management
 */
export function QuickActions({
  onCreateRequest,
  onUpdateMileage,
  onAddMaintenance,
  onEditVehicle
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          className="w-full"
          onClick={onCreateRequest}
        >
          Create Service Request
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onUpdateMileage}
        >
          Update Mileage
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onAddMaintenance}
        >
          Add Maintenance Record
        </Button>
        <Button 
          variant="ghost" 
          className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={onEditVehicle}
        >
          Edit Vehicle Details
        </Button>
      </CardContent>
    </Card>
  );
}
