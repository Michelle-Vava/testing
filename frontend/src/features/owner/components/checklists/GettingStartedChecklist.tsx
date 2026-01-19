import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { Check, Car, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useRequests } from '@/features/requests/hooks/use-requests';

interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  icon: React.ReactNode;
}

export function GettingStartedChecklist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles } = useVehicles();
  const { requests } = useRequests();

  const steps: ChecklistStep[] = [
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Add your address for accurate service quotes',
      completed: !!user?.address && !!user?.city,
      action: () => navigate({ to: '/owner/settings' }),
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: 'vehicle',
      title: 'Add a vehicle',
      description: 'Register your car to request service',
      completed: (vehicles?.length ?? 0) > 0,
      action: () => navigate({ to: '/owner/vehicles/new' }),
      icon: <Car className="h-5 w-5" />,
    },
    {
      id: 'request',
      title: 'Create your first request',
      description: 'Get quotes from local mechanics',
      completed: (requests?.length ?? 0) > 0,
      action: () => navigate({ to: '/owner/requests/new', search: { serviceType: undefined, providerId: undefined } }),
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const isComplete = completedCount === steps.length;

  // Hide if fully complete
  if (isComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Getting Started</h3>
        <span className="text-sm text-slate-600">
          {completedCount}/{steps.length} completed
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={step.action}
            disabled={step.completed}
            className={`
              w-full text-left p-4 rounded-lg border transition-all
              ${
                step.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200 hover:border-yellow-500 hover:bg-yellow-50 cursor-pointer'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0
                  ${step.completed ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}
                `}
              >
                {step.completed ? <Check className="h-5 w-5" /> : step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium mb-1 ${
                    step.completed ? 'text-green-900' : 'text-slate-900'
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-sm ${
                    step.completed ? 'text-green-700' : 'text-slate-600'
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
