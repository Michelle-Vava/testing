import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastContext';
import { useAuthControllerForgotPassword } from '@/services/generated/auth/auth';

/**
 * Props for the ForgotPasswordSection component.
 */
interface ForgotPasswordSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ForgotPasswordSection Component
 * 
 * Handles the password reset request flow.
 * 
 * Features:
 * - Validates email input.
 * - Calls `authControllerForgotPassword` API to trigger reset email.
 * - Displays success state ("Check your inbox") upon successful API call.
 * - Handles errors via Toast notifications.
 */
export function ForgotPasswordSection({ isOpen, onClose }: ForgotPasswordSectionProps) {
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const toast = useToast();

  const {
    mutate: requestReset,
    isPending: isResetting
  } = useAuthControllerForgotPassword({
    mutation: {
      onSuccess: () => {
        setResetSent(true);
        // Auto-close after success message is shown for a few seconds
        setTimeout(() => {
          onClose();
          setResetSent(false);
          setResetEmail('');
        }, 5000);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Failed to send reset email. Please try again.';
        toast.error(message);
      }
    }
  });

  const handleSendReset = () => {
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    requestReset({ data: { email: resetEmail } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden bg-slate-50 -mx-8 px-8 py-4 rounded-lg border border-slate-200"
        >
          {!resetSent ? (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">Reset your password</h4>
              <p className="text-sm text-slate-600">We'll email you a reset link. No spam.</p>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isResetting}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSendReset}
                  disabled={isResetting}
                >
                  {isResetting ? 'Sending...' : 'Send reset link'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2"
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-900">Check your inbox!</p>
              <p className="text-sm text-slate-600 mt-1">We sent a reset link to {resetEmail}</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
