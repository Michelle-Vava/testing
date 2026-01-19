import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import type { OnboardingStep, FieldError } from './types';

interface OnboardingFooterProps {
  currentStep: OnboardingStep;
  stepConfig: Record<OnboardingStep, { title: string; number: number }>;
  lastSaved: Date | null;
  isSaving: boolean;
  errors: FieldError;
  onBack: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  onSubmit: () => void;
  isSimplified?: boolean;
}

export function OnboardingFooter({
  currentStep,
  stepConfig,
  lastSaved,
  isSaving,
  errors,
  onBack,
  onContinue,
  onSkip,
  onSubmit,
  isSimplified = false,
}: OnboardingFooterProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Progress + Save Status */}
          <div className="flex items-center gap-4">
            {!isSimplified && (
              <span className="text-sm text-slate-600 font-medium">
                Step {stepConfig[currentStep].number} of 3 • {stepConfig[currentStep].title}
              </span>
            )}
            <AnimatePresence>
              {lastSaved && (
                <motion.span 
                  className="text-xs text-green-600 flex items-center gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Draft saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            {isSimplified ? (
              // Simplified: Single "Get Started" Button
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onSubmit}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Getting Started...
                    </>
                  ) : (
                    'Get Started'
                  )}
                </Button>
              </motion.div>
            ) : (
              // Multi-step: Continue/Back/Skip Buttons
              <>
                {/* Skip Button for Services Step */}
                {currentStep === 'services' && onSkip && (
                  <Button
                    variant="ghost"
                    onClick={onSkip}
                    disabled={isSaving}
                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  >
                    Skip for now
                  </Button>
                )}

                {currentStep !== 'business' && (
                  <Button
                    variant="outline"
                    onClick={onBack}
                    disabled={isSaving}
                  >
                    Back
                  </Button>
                )}

                {currentStep !== 'review' ? (
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onContinue}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onSubmit}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Completing...
                        </>
                      ) : (
                        'Complete Setup'
                      )}
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {errors.submit && (
            <motion.p 
              className="text-sm text-red-600 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {errors.submit}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
