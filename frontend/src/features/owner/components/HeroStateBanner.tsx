import { useNavigate } from '@tanstack/react-router';
import { Car, FileText, Calendar, CheckCircle } from 'lucide-react';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useRequests } from '@/features/requests/hooks/use-requests';
import { Button } from '@/components/ui/button';

export function HeroStateBanner() {
  const navigate = useNavigate();
  const { vehicles, isLoading: vehiclesLoading } = useVehicles();
  const { requests, isLoading: requestsLoading } = useRequests();

  if (vehiclesLoading || requestsLoading) {
    return (
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-8">
        <div className="h-8 bg-slate-600 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="h-4 bg-slate-600 rounded w-3/4 animate-pulse"></div>
      </div>
    );
  }

  const hasVehicles = vehicles && vehicles.length > 0;
  const hasRequests = requests && requests.length > 0;
  const activeRequest = requests?.find(r => r.status === 'open' || r.status === 'quoted');
  const hasBooking = requests?.some(r => r.status === 'accepted');

  // State 4: Has booking (job in progress)
  if (hasBooking) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Service Scheduled!</h2>
            </div>
            <p className="text-green-100 mb-4">
              Your service is confirmed. Check your upcoming appointments for details.
            </p>
            <Button
              onClick={() => navigate({ to: '/owner/jobs' })}
              variant="secondary"
              className="bg-white text-green-700 hover:bg-green-50"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View Appointments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Has request (waiting for quotes)
  if (hasRequests && activeRequest) {
    return (
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Request Active</h2>
            </div>
            <p className="text-yellow-100 mb-4">
              You have an active service request. Local mechanics are reviewing and will send quotes soon.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate({ to: '/owner/requests' })}
                variant="secondary"
                className="bg-white text-yellow-700 hover:bg-yellow-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                View Request
              </Button>
              <Button
                onClick={() => navigate({ to: '/owner/providers' })}
                variant="outline"
                className="border-white text-white hover:bg-yellow-500"
              >
                Browse Providers
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Has vehicle (ready to request service)
  if (hasVehicles) {
    return (
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Car className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Ready for Service?</h2>
            </div>
            <p className="text-slate-300 mb-4">
              You have {vehicles.length} vehicle{vehicles.length > 1 ? 's' : ''} registered. 
              Request service and get competitive quotes from local mechanics.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate({ to: '/owner/requests/new', search: { serviceType: undefined, providerId: undefined } })}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
              >
                <FileText className="mr-2 h-4 w-4" />
                Request Service
              </Button>
              <Button
                onClick={() => navigate({ to: '/owner/vehicles' })}
                variant="outline"
                className="border-white text-white hover:bg-slate-700"
              >
                <Car className="mr-2 h-4 w-4" />
                Manage Vehicles
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 1: No vehicles (needs to add vehicle first)
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-8 text-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Get Started</h2>
          </div>
          <p className="text-slate-300 mb-4">
            Add your vehicle to start requesting service quotes from local mechanics in Halifax.
          </p>
          <Button
            onClick={() => navigate({ to: '/owner/vehicles/new' })}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
          >
            <Car className="mr-2 h-4 w-4" />
            Add Your First Vehicle
          </Button>
        </div>
      </div>
    </div>
  );
}
