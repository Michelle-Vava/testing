import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, ArrowLeft, ArrowRight, FileText, Car, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useRequestsControllerCreate } from '@/services/generated/requests/requests';
import { useQueryClient } from '@tanstack/react-query';

const SERVICE_TYPES = [
  { id: 'oil-change', label: 'Oil Change', icon: '🛢️' },
  { id: 'brakes', label: 'Brakes', icon: '🛑' },
  { id: 'tires', label: 'Tires', icon: '🛞' },
  { id: 'battery', label: 'Battery', icon: '🔋' },
  { id: 'diagnostic', label: 'Diagnostic', icon: '🔍' },
  { id: 'transmission', label: 'Transmission', icon: '⚙️' },
  { id: 'suspension', label: 'Suspension', icon: '🏎️' },
  { id: 'other', label: 'Other', icon: '❓' },
];

type Step = 1 | 2 | 3 | 4;

interface WizardState {
  step: Step;
  serviceType: string;
  selectedVehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  description: string;
}

export function RequestWizard() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicles();
  const queryClient = useQueryClient();
  const { mutate: createRequest, isPending: isCreating } = useRequestsControllerCreate({
    mutation: {
      onSuccess: () => {
        // Invalidate requests queries to refetch the list
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        success('Your service request has been posted! Providers will start sending quotes.');
        navigate({ to: '/owner/requests' });
      },
      onError: () => {
        error('Failed to create request. Please try again.');
      },
    },
  });

  const [state, setState] = useState<WizardState>({
    step: 1,
    serviceType: '',
    selectedVehicleId: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    description: '',
  });

  const handleNext = () => {
    // Validation
    if (state.step === 1 && !state.serviceType) {
      error('Please select a service type');
      return;
    }

    // Step 2 (vehicle) is required by backend
    if (state.step === 2) {
      const hasVehicle = state.selectedVehicleId || (state.vehicleMake && state.vehicleModel && state.vehicleYear);
      if (!hasVehicle) {
        error('Please select or enter vehicle details');
        return;
      }
    }

    if (state.step === 3 && !state.description.trim()) {
      error('Please describe the issue');
      return;
    }

    setState(prev => ({ ...prev, step: (prev.step + 1) as Step }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: (prev.step - 1) as Step }));
  };

  const handleSubmit = () => {
    const serviceLabel = SERVICE_TYPES.find(s => s.id === state.serviceType)?.label || state.serviceType;

    createRequest({
      data: {
        vehicleId: state.selectedVehicleId || undefined,
        make: !state.selectedVehicleId ? state.vehicleMake : undefined,
        model: !state.selectedVehicleId ? state.vehicleModel : undefined,
        year: (!state.selectedVehicleId && state.vehicleYear) ? parseInt(state.vehicleYear) : undefined,
        title: serviceLabel,
        description: state.description,
        urgency: 'medium',
      },
    });
  };

  // Step 1: Service Type Selection
  if (state.step === 1) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white/92 mb-1">
                What do you need?
              </h1>
              <p className="text-slate-600 dark:text-white/65 text-sm">
                Select the service type or choose "Other" if you're not sure
              </p>
            </div>

            <Card className="dark:bg-[#101A2E] dark:border-white/6">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SERVICE_TYPES.map(service => (
                    <button
                      key={service.id}
                      onClick={() => setState(prev => ({ ...prev, serviceType: service.id }))}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        state.serviceType === service.id
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
                          : 'border-slate-200 dark:border-white/12 hover:border-yellow-400 dark:hover:border-yellow-400/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{service.icon}</div>
                      <div className="text-xs font-medium text-slate-900 dark:text-white/92">
                        {service.label}
                      </div>
                    </button>
                  ))}
                </div>

                {state.serviceType === 'other' && (
                  <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-300">
                      No problem! Describe what you need in the next step and providers will help diagnose.
                    </p>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={handleNext}
                    disabled={!state.serviceType}
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="dark:bg-[#101A2E] dark:border-white/6">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white/92 mb-3 text-sm">
                    How it works
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 text-slate-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white/92">Pick service</p>
                        <p className="text-xs text-slate-600 dark:text-white/60">What needs fixing?</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-white/20 text-slate-700 dark:text-white/70 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-white/60">Add vehicle (optional)</p>
                        <p className="text-xs text-slate-500 dark:text-white/50">Quick or detailed</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-white/20 text-slate-700 dark:text-white/70 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-white/60">Describe issue</p>
                        <p className="text-xs text-slate-500 dark:text-white/50">More detail = better quotes</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-300 dark:bg-white/20 text-slate-700 dark:text-white/70 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        4
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-white/60">Post & get quotes</p>
                        <p className="text-xs text-slate-500 dark:text-white/50">Usually within hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2 max-w-md mx-auto lg:max-w-none lg:w-2/3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded transition-all ${
                i <= state.step ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-white/12'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Vehicle Details
  if (state.step === 2) {
    const hasVehicleSelected = state.selectedVehicleId || (state.vehicleMake && state.vehicleModel);
    
    return (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white/92 mb-1">
                Which vehicle?
              </h1>
              <p className="text-slate-600 dark:text-white/65 text-sm">
                Select from garage or enter make/model
              </p>
            </div>

            <Card className="dark:bg-[#101A2E] dark:border-white/6">
              <CardContent className="p-4 space-y-4">
                {/* Existing Vehicles */}
                {vehicles.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-white/80 mb-2 uppercase tracking-wide">
                      Your Garage
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {vehicles.map(vehicle => (
                        <button
                          key={vehicle.id}
                          onClick={() =>
                            setState(prev => ({
                              ...prev,
                              selectedVehicleId: vehicle.id,
                              vehicleMake: '',
                              vehicleModel: '',
                              vehicleYear: '',
                            }))
                          }
                          className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                            state.selectedVehicleId === vehicle.id
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
                              : 'border-slate-200 dark:border-white/12 hover:border-yellow-400'
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-900 dark:text-white/92">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider */}
                {vehicles.length > 0 && (
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-white/12" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white dark:bg-[#101A2E] text-slate-500 dark:text-white/45">
                        or enter quickly
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Entry */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-white/80 mb-2 uppercase tracking-wide">
                    Quick Entry
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Make"
                      value={state.vehicleMake}
                      onChange={e => setState(prev => ({ ...prev, vehicleMake: e.target.value, selectedVehicleId: '' }))}
                      className="px-3 py-2 border border-slate-200 dark:border-white/12 dark:bg-[#0B1220] dark:text-white/92 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Model"
                      value={state.vehicleModel}
                      onChange={e => setState(prev => ({ ...prev, vehicleModel: e.target.value, selectedVehicleId: '' }))}
                      className="px-3 py-2 border border-slate-200 dark:border-white/12 dark:bg-[#0B1220] dark:text-white/92 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={state.vehicleYear}
                      onChange={e => setState(prev => ({ ...prev, vehicleYear: e.target.value, selectedVehicleId: '' }))}
                      className="px-3 py-2 border border-slate-200 dark:border-white/12 dark:bg-[#0B1220] dark:text-white/92 rounded-lg text-sm"
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1.5">
                    Helps providers give accurate quotes
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" onClick={handleBack} size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleNext}
                      disabled={!hasVehicleSelected}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                      size="sm"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="dark:bg-[#101A2E] dark:border-white/6">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white/92 mb-3 text-sm">
                    Your request
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-white/50">Service</p>
                      <p className="font-medium text-slate-900 dark:text-white/92">
                        {SERVICE_TYPES.find(s => s.id === state.serviceType)?.label}
                      </p>
                    </div>
                    {hasVehicleSelected && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-white/50">Vehicle</p>
                        <p className="font-medium text-slate-900 dark:text-white/92">
                          {state.selectedVehicleId 
                            ? `${vehicles.find(v => v.id === state.selectedVehicleId)?.year} ${vehicles.find(v => v.id === state.selectedVehicleId)?.make} ${vehicles.find(v => v.id === state.selectedVehicleId)?.model}`
                            : `${state.vehicleYear} ${state.vehicleMake} ${state.vehicleModel}`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2 max-w-md mx-auto lg:max-w-none lg:w-2/3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded transition-all ${
                i <= state.step ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-white/12'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Describe Issue
  if (state.step === 3) {
    const hasVehicleSelected = state.selectedVehicleId || (state.vehicleMake && state.vehicleModel);
    
    return (
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white/92 mb-1">
                What's happening?
              </h1>
              <p className="text-slate-600 dark:text-white/65 text-sm">
                More details = more accurate quotes from providers
              </p>
            </div>

            <Card className="dark:bg-[#101A2E] dark:border-white/6">
              <CardContent className="p-4 space-y-3">
                <textarea
                  value={state.description}
                  onChange={e => setState(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Example: Grinding noise when braking, started last week and getting worse. Happens mostly when slowing down at lights..."
                  className="w-full h-36 px-3 py-2.5 border border-slate-200 dark:border-white/12 dark:bg-[#0B1220] dark:text-white/92 dark:placeholder:text-white/45 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />

                <div className="flex justify-between items-center text-xs">
                  <p className="text-slate-500 dark:text-white/45">
                    {state.description.length}/500 characters
                  </p>
                  <p className="text-amber-600 dark:text-amber-400">
                    💡 Mention: When it started, sounds, how it affects driving
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" onClick={handleBack} size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!state.description.trim()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                    size="sm"
                  >
                    Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="dark:bg-[#101A2E] dark:border-white/6">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white/92 mb-3 text-sm">
                    Your request
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-white/50">Service</p>
                      <p className="font-medium text-slate-900 dark:text-white/92">
                        {SERVICE_TYPES.find(s => s.id === state.serviceType)?.label}
                      </p>
                    </div>
                    {hasVehicleSelected && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-white/50">Vehicle</p>
                        <p className="font-medium text-slate-900 dark:text-white/92">
                          {state.selectedVehicleId 
                            ? `${vehicles.find(v => v.id === state.selectedVehicleId)?.year} ${vehicles.find(v => v.id === state.selectedVehicleId)?.make} ${vehicles.find(v => v.id === state.selectedVehicleId)?.model}`
                            : `${state.vehicleYear} ${state.vehicleMake} ${state.vehicleModel}`
                          }
                        </p>
                      </div>
                    )}
                    {state.description && (
                      <div>
                        <p className="text-xs text-slate-500 dark:text-white/50">Description</p>
                        <p className="text-xs text-slate-700 dark:text-white/80 line-clamp-3">
                          {state.description}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 flex gap-2 max-w-md mx-auto lg:max-w-none lg:w-2/3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded transition-all ${
                i <= state.step ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-white/12'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Confirm & Post
  const serviceLabel = SERVICE_TYPES.find(s => s.id === state.serviceType)?.label || state.serviceType;
  const vehicleLabel = state.selectedVehicleId
    ? vehicles.find(v => v.id === state.selectedVehicleId)
      ? `${vehicles.find(v => v.id === state.selectedVehicleId)?.year} ${vehicles.find(v => v.id === state.selectedVehicleId)?.make} ${vehicles.find(v => v.id === state.selectedVehicleId)?.model}`
      : null
    : state.vehicleMake && state.vehicleModel && state.vehicleYear
    ? `${state.vehicleYear} ${state.vehicleMake} ${state.vehicleModel}`
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white/92 mb-2">
          Ready to post?
        </h1>
        <p className="text-slate-600 dark:text-white/65">
          Review your request before posting
        </p>
      </div>

      <Card className="dark:bg-[#101A2E] dark:border-white/6">
        <CardContent className="p-6 space-y-6">
          {/* Summary */}
          <div className="space-y-4">
            {/* Service Type */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-white/45 uppercase tracking-wide">Service Type</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white/92">
                  {serviceLabel}
                </p>
              </div>
            </div>

            {/* Vehicle */}
            {vehicleLabel && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 dark:text-white/45 uppercase tracking-wide">Vehicle</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white/92">
                    {vehicleLabel}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-white/45 uppercase tracking-wide">Details</p>
                <p className="text-slate-700 dark:text-white/92 whitespace-pre-wrap">
                  {state.description}
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-900 dark:text-green-300">
                <strong>Ready to go!</strong> Your request will be sent to local providers. You'll get quotes within hours.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={isCreating}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreating}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-6"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  Post Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex gap-2 justify-center">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              i <= state.step ? 'bg-yellow-500' : 'bg-slate-200 dark:bg-white/12'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
