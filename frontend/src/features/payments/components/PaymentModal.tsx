import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customInstance } from '@/lib/axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { env } from '@/config/env';
import { Stripe } from '@stripe/stripe-js';

// Lazily initialize Stripe to avoid loading scripts on import
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise && env.STRIPE_PUBLIC_KEY) {
    stripePromise = loadStripe(env.STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  amount: number;
}

function CheckoutForm({ 
  clientSecret, 
  paymentId, 
  onSuccess, 
  onClose 
}: { 
  clientSecret: string; 
  paymentId: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const completePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => customInstance({
      url: `/payments/complete/${paymentId}`,
      method: 'POST'
    }),
    onSuccess: () => {
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: 'Payment Failed',
        description: 'Payment was authorized but failed to complete on our server.',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded, now notify backend
        await completePaymentMutation.mutateAsync(paymentId);
      } else {
        setErrorMessage('Payment status: ' + (paymentIntent?.status || 'unknown'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </Button>
      </div>
    </form>
  );
}

export function PaymentModal({ isOpen, onClose, jobId, amount }: PaymentModalProps) {
  const queryClient = useQueryClient();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Lazy load stripe ONLY when modal is open
  const stripe = React.useMemo(() => {
    return isOpen ? getStripe() : null;
  }, [isOpen]);

  // Create Charge (Get Client Secret)
  const createChargeMutation = useMutation({
    mutationFn: () => customInstance<{ payment: { id: string }, clientSecret: string }>({
      url: `/payments/charge/${jobId}`,
      method: 'POST'
    }),
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setPaymentId(data.payment.id);
    }
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen && !clientSecret) {
      createChargeMutation.mutate();
    }
    if (!isOpen) {
      setClientSecret(null);
      setPaymentId(null);
    }
  }, [isOpen]);

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay for the completed service to release funds to the provider.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 rounded-lg">
            <span className="text-sm font-medium text-slate-500">Total Amount</span>
            <span className="text-2xl font-bold text-slate-900">${amount.toFixed(2)}</span>
          </div>
          
          {clientSecret && paymentId ? (
            <Elements stripe={stripe} options={{ clientSecret }}>
              <CheckoutForm 
                clientSecret={clientSecret} 
                paymentId={paymentId}
                onSuccess={handleSuccess}
                onClose={onClose}
              />
            </Elements>
          ) : (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
