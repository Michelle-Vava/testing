import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePartsInventory } from '@/features/parts/hooks/use-parts-inventory';
import { useToast } from '@/components/ui/ToastContext';

const partSchema = z.object({
  name: z.string().min(1, 'Part name required'),
  category: z.string().optional(),
  condition: z.enum(['OEM', 'AFTERMARKET', 'USED']),
  price: z.number().min(0, 'Price must be positive'),
  notes: z.string().optional(),
});

type PartFormData = z.infer<typeof partSchema>;

interface AddPartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPartModal({ isOpen, onClose }: AddPartModalProps) {
  const toast = useToast();
  const { createPart, isCreating } = usePartsInventory();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      condition: 'AFTERMARKET',
    },
  });

  const onSubmit = async (data: PartFormData) => {
    try {
      await createPart(data as any);
      toast.success('Part added to inventory');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to add part');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full dark:bg-[#101A2E] dark:border-white/12">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="dark:text-white/92">Add Part to Inventory</CardTitle>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name" className="dark:text-white/92">Part Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Front brake pads"
                className="dark:bg-[#0B1220] dark:border-white/12 dark:text-white/92"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="category" className="dark:text-white/92">Category</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="brakes, filters, fluids, etc"
                className="dark:bg-[#0B1220] dark:border-white/12 dark:text-white/92"
              />
            </div>

            <div>
              <Label htmlFor="condition" className="dark:text-white/92">Condition *</Label>
              <select
                id="condition"
                {...register('condition')}
                className="w-full px-4 py-2 border rounded-lg dark:bg-[#0B1220] dark:border-white/12 dark:text-white/92"
              >
                <option value="OEM">OEM</option>
                <option value="AFTERMARKET">Aftermarket</option>
                <option value="USED">Used</option>
              </select>
            </div>

            <div>
              <Label htmlFor="price" className="dark:text-white/92">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
                className="dark:bg-[#0B1220] dark:border-white/12 dark:text-white/92"
              />
              {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="notes" className="dark:text-white/92">Notes</Label>
              <textarea
                id="notes"
                {...register('notes')}
                placeholder="Fitment info, brand, etc"
                rows={3}
                className="w-full px-4 py-2 border rounded-lg dark:bg-[#0B1220] dark:border-white/12 dark:text-white/92"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 dark:border-white/12 dark:text-white/92"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add Part'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
