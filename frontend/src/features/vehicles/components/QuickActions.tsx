import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  vehicleId: string;
  currentMileage?: number;
  onCreateRequest: () => void;
  onUpdateMileage: () => void;
  onAddMaintenance: () => void;
}

/**
 * Quick action buttons for vehicle management
 */
export function QuickActions({
  onCreateRequest,
  onUpdateMileage,
  onAddMaintenance
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
      </CardContent>
    </Card>
  );
}
