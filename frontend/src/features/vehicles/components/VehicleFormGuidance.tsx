import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

/**
 * Sidebar with helpful information for adding a vehicle
 */
export function VehicleFormGuidance() {
  return (
    <div className="space-y-4">
      {/* VIN Location Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            Quick Tip: Use Your VIN
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700">
          <p className="mb-2">Your VIN is located on:</p>
          <ul className="space-y-1 text-xs">
            <li>• Driver's side dashboard (visible through windshield)</li>
            <li>• Driver's side door jamb sticker</li>
            <li>• Vehicle registration document</li>
            <li>• Insurance card</li>
          </ul>
          <p className="mt-2 text-xs text-slate-600">Works for Canadian and US vehicles</p>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900">What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <div className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
            <p>Your vehicle is added to your garage</p>
          </div>
          <div className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
            <p>You can create service requests for this vehicle</p>
          </div>
          <div className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
            <p>Mechanics will see your vehicle details when quoting</p>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900">Why add a vehicle?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p>• Get accurate quotes tailored to your specific vehicle</p>
          <p>• Track service history and maintenance records</p>
          <p>• Faster booking process for future requests</p>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-slate-900 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Your data is safe
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>Your vehicle information is encrypted and only shared with mechanics you choose to contact.</p>
        </CardContent>
      </Card>
    </div>
  );
}
