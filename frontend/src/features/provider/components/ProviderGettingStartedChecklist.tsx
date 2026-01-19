import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { Check, User, MapPin, DollarSign, Image } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';

interface ChecklistStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  action?: () => void;
  icon: React.ReactNode;
}

export function ProviderGettingStartedChecklist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Logic to determine completion
  const hasBusinessDetails = user?.businessName && user?.phoneNumber;
  const hasLocation = user?.shopAddress || user?.address;
  // Check provider profile for stripe id
  const hasPaymentSetup = !!(user as any)?.stripeAccountId; 
  const hasPhotos = (user?.shopPhotos?.length || 0) > 0;

  const steps: ChecklistStep[] = [
    {
      id: 'profile',
      title: 'Complete business profile',
      description: 'Business name, contact info, and description',
      completed: !!hasBusinessDetails && !!hasLocation,
      action: () => navigate({ to: '/provider/profile' }),
      icon: <User className="h-5 w-5" />,
    },
    {
      id: 'photos',
      title: 'Add shop photos',
      description: 'Profiles with photos get 2x more requests',
      completed: hasPhotos,
      action: () => navigate({ to: '/provider/profile' }),
      icon: <Image className="h-5 w-5" />,
    },
    {
      id: 'payments',
      title: 'Set up payouts',
      description: 'Connect your bank account to receive payments',
      completed: hasPaymentSetup,
      action: () => navigate({ to: '/provider/payments' }),
      icon: <DollarSign className="h-5 w-5" />,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const isComplete = completedCount === steps.length;

  // If fully complete, we don't need to show this
  if (isComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Finish setting up your account</h3>
          <p className="text-sm text-slate-500">Complete these steps to unlock full access</p>
        </div>
        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {completedCount}/{steps.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(completedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={step.action}
            disabled={step.completed}
            className={`
              w-full text-left p-4 rounded-lg border transition-all relative overflow-hidden group
              ${
                step.completed
                  ? 'bg-green-50 border-green-200 opacity-80'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start gap-3 relative z-10">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-colors
                  ${step.completed ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}
                `}
              >
                {step.completed ? <Check className="h-5 w-5" /> : step.icon}
              </div>
              <div>
                <h4 className={`font-medium ${step.completed ? 'text-green-900' : 'text-slate-900'}`}>
                  {step.title}
                </h4>
                <p className={`text-sm mt-1 ${step.completed ? 'text-green-700' : 'text-slate-500'}`}>
                   {step.completed ? 'Completed' : step.description}
                </p>
              </div>
            </div>
            
            {/* Completion Badge */}
            {step.completed && (
                <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-green-600" />
                </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
