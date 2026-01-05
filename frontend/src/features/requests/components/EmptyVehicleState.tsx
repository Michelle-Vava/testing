import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Empty state component displayed when user has no vehicles.
 * 
 * Shows a call-to-action to add their first vehicle before creating service requests.
 * Prevents users from creating requests without a vehicle to service.
 * 
 * @component
 * @example
 * ```tsx
 * {vehicles.length === 0 && <EmptyVehicleState />}
 * ```
 */
export function EmptyVehicleState() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="text-center py-16">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your First Vehicle</h2>
          <p className="text-gray-600 mb-6">
            You need to add a vehicle before creating a service request
          </p>
          <Link to="/owner/vehicles/new">
            <Button size="lg">Add Vehicle</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
