import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useProviderOnboarding } from '../hooks/use-provider-onboarding';
import { BusinessInfoStep } from './onboarding/BusinessInfoStep';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

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

export function ProviderSetup() {
  const { form, onSubmit, isSubmitting, hasDraft } = useProviderOnboarding();
  const { formState: { errors } } = form;

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
            Start receiving service requests
          </h1>
          <p className="text-slate-600">
            Takes less than 1 minute. Just the essentials.
          </p>
          {hasDraft && (
            <motion.p
              className="text-sm text-green-600 mt-2 flex items-center justify-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="w-4 h-4" />
              Draft restored - Continue where you left off
            </motion.p>
          )}
        </motion.div>

        {/* Form */}
        <form onSubmit={onSubmit}>
          <Card className="shadow-lg mb-8">
            <CardContent className="p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <BusinessInfoStep form={form} serviceTypes={SERVICE_TYPES} />
              </motion.div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-end">
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
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
            </div>
            {errors.root && (
              <motion.p
                className="text-sm text-red-600 text-center pb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.root.message}
              </motion.p>
            )}
          </motion.div>
        </form>
      </div>
    </div>
  );
}
