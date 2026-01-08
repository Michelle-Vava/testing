import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingForm } from './onboarding/useOnboardingForm';
import { OnboardingStepper } from './onboarding/OnboardingStepper';
import { OnboardingFooter } from './onboarding/OnboardingFooter';
import { BusinessInfoStep } from './onboarding/BusinessInfoStep';
import { ServicesStep } from './onboarding/ServicesStep';
import { ReviewStep } from './onboarding/ReviewStep';

const SERVICE_TYPES = [
  'Oil Change',
  'Tire Service',
  'Brake Service',
  'Engine Diagnostic',
  'Transmission Service',
  'Battery Service',
  'Air Conditioning',
  'General Maintenance',
  'Electrical Systems',
  'Suspension & Steering',
  'Exhaust Systems',
  'Body Work',
];

const STEP_CONFIG = {
  business: { title: 'Business Info', number: 1 },
  services: { title: 'Services & Coverage', number: 2 },
  review: { title: 'Review', number: 3 },
} as const;

export function ProviderSetup() {
  const {
    currentStep,
    profile,
    errors,
    isSaving,
    lastSaved,
    handleContinue,
    handleBack,
    handleSubmit,
    toggleServiceType,
    updateField,
  } = useOnboardingForm();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Let's get you set up to start receiving requests
          </h1>
          <p className="text-slate-600">
            Takes ~2 minutes. You can finish the rest anytime.
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <OnboardingStepper currentStep={currentStep} stepConfig={STEP_CONFIG} />

        {/* Step Content */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {currentStep === 'business' && (
                <motion.div
                  key="business"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  layout
                >
                  <BusinessInfoStep
                    profile={profile}
                    errors={errors}
                    updateField={updateField}
                  />
                </motion.div>
              )}

              {currentStep === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  layout
                >
                  <ServicesStep
                    profile={profile}
                    errors={errors}
                    serviceTypes={SERVICE_TYPES}
                    toggleServiceType={toggleServiceType}
                    updateField={updateField}
                  />
                </motion.div>
              )}

              {currentStep === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  layout
                >
                  <ReviewStep profile={profile} />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Sticky Footer */}
        <OnboardingFooter
          currentStep={currentStep}
          stepConfig={STEP_CONFIG}
          lastSaved={lastSaved}
          isSaving={isSaving}
          errors={errors}
          onBack={handleBack}
          onContinue={handleContinue}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
