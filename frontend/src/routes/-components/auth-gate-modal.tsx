import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { authGateStore } from '@/features/auth/stores/auth-gate-store';

export function AuthGateModal() {
  const navigate = useNavigate();
  const [state, setState] = useState(authGateStore.getState());

  useEffect(() => {
    const unsubscribe = authGateStore.subscribe(() => {
      setState(authGateStore.getState());
    });
    return unsubscribe;
  }, []);

  const handleClose = () => {
    authGateStore.close();
  };

  const handleSignUp = () => {
    const params: any = {};
    if (state.intent?.providerId) {
      params.providerId = state.intent.providerId;
    }
    if (state.intent?.role) {
      params.role = state.intent.role;
    }
    if (state.intent?.action) {
      params.intent = state.intent.action;
    }
    navigate({ to: '/auth/signup', search: params });
    authGateStore.close();
  };

  const handleSignIn = () => {
    const params: any = {};
    if (state.intent?.role) {
      params.role = state.intent.role;
    }
    navigate({ to: '/auth/login', search: params });
    authGateStore.close();
  };

  // Determine messaging based on intent
  const getModalContent = () => {
    const intent = state.intent;
    const isProviderIntent = intent?.role === 'provider';
    const providerName = intent?.providerName;
    const action = intent?.action;

    if (isProviderIntent) {
      const title = action === 'apply as a provider' 
        ? 'Apply as a Mechanic'
        : 'Sign in to submit a quote';
      
      return {
        title,
        subtitle: 'Mechanic accounts are reviewed before activation',
        buttonText: 'Continue',
        secondaryText: 'I already have an account',
        steps: [
          'Submit your qualifications',
          'Get verified by our team',
          'Start receiving quote requests',
        ],
      };
    }

    if (providerName) {
      return {
        title: `Request a quote from ${providerName}`,
        subtitle: "You're signing in as a vehicle owner",
        buttonText: 'Continue',
        secondaryText: 'I already have an account',
        steps: [
          'Describe your car issue',
          'Get quotes from verified mechanics',
          'Choose the best option',
        ],
      };
    }

    return {
      title: 'Create an account to request quotes',
      subtitle: "You're signing in as a vehicle owner",
      buttonText: 'Continue',
      secondaryText: 'I already have an account',
      steps: [
        'Describe your car issue',
        'Get quotes from verified mechanics',
        'Choose the best option',
      ],
    };
  };

  const content = getModalContent();

  return (
    <Modal isOpen={state.isOpen} onClose={handleClose} title={content.title}>
      <div className="py-6">
        <div className="text-center mb-6">
          <p className="text-sm text-slate-500">{content.subtitle}</p>
        </div>

        {/* Next Steps Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-slate-900 mb-3">After you sign in:</p>
          <ul className="space-y-2">
            {content.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust Signal */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start gap-2 text-sm text-primary-800">
            <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Free forever • No credit card required</p>
            </div>
          </div>
        </div>
      </div>
      <ModalFooter>
        <Button variant="ghost" onClick={handleClose} className="text-sm">
          Cancel
        </Button>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleSignIn}>
            {content.secondaryText}
          </Button>
          <Button onClick={handleSignUp}>
            {content.buttonText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
