import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { quoteSubmissionSchema, type QuoteSubmissionFormData } from '@/lib/schemas/form-schemas';
import { useQuotes } from '@/features/requests/hooks/use-requests';
import { useToast } from '@/components/ui/ToastContext';

interface QuoteSubmissionModalProps {
  requestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuoteSubmissionModal({ 
  requestId, 
  isOpen, 
  onClose, 
  onSuccess 
}: QuoteSubmissionModalProps) {
  const toast = useToast();
  const { createQuote, isCreating } = useQuotes(requestId);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<QuoteSubmissionFormData>({
    resolver: zodResolver(quoteSubmissionSchema),
    defaultValues: {
      laborCost: '',
      partsCost: '',
      estimatedDuration: '',
      description: '',
      includesWarranty: true,
    },
  });

  const laborCost = watch('laborCost');
  const partsCost = watch('partsCost');
  const totalAmount = (Number(laborCost) || 0) + (Number(partsCost) || 0);

  const onSubmit = async (data: QuoteSubmissionFormData) => {
    try {
      await createQuote({
        requestId,
        amount: totalAmount.toString(),
        laborCost: data.laborCost,
        partsCost: data.partsCost,
        estimatedDuration: data.estimatedDuration,
        description: data.description,
        includesWarranty: data.includesWarranty,
      });
      
      toast.success('Quote submitted successfully!');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit quote:', error);
      toast.error('Failed to submit quote. Please try again.');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Submit Quote">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="laborCost">Labor Cost *</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">$</span>
              <Input
                {...register('laborCost')}
                type="number"
                step="0.01"
                className="pl-7"
                placeholder="0.00"
              />
            </div>
            {errors.laborCost && (
              <p className="text-sm text-red-600 mt-1">{errors.laborCost.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="partsCost">Parts Cost *</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">$</span>
              <Input
                {...register('partsCost')}
                type="number"
                step="0.01"
                className="pl-7"
                placeholder="0.00"
              />
            </div>
            {errors.partsCost && (
              <p className="text-sm text-red-600 mt-1">{errors.partsCost.message}</p>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-sm text-slate-600">
            Total Estimate: <span className="font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
          </p>
        </div>

        <div>
          <Label htmlFor="estimatedDuration">Estimated Duration *</Label>
          <Input
            {...register('estimatedDuration')}
            placeholder="e.g., 2-3 hours"
          />
          {errors.estimatedDuration && (
            <p className="text-sm text-red-600 mt-1">{errors.estimatedDuration.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            {...register('description')}
            rows={4}
            placeholder="Describe the work to be done, parts needed, etc."
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register('includesWarranty')}
            type="checkbox"
            id="includesWarranty"
            className="rounded border-slate-300"
          />
          <Label htmlFor="includesWarranty" className="font-normal">
            This quote includes a warranty
          </Label>
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Submitting...' : 'Submit Quote'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
