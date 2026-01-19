import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  partsControllerGetMyInventory,
  partsControllerCreate,
  partsControllerRemove 
} from '@/services/generated/parts/parts';
import type { CreatePartDto } from '@/services/generated/model';

export function usePartsInventory() {
  const queryClient = useQueryClient();

  const { data: parts, isLoading } = useQuery({
    queryKey: ['parts', 'inventory'],
    queryFn: () => partsControllerGetMyInventory(),
  });

  const createPart = useMutation({
    mutationFn: (data: CreatePartDto) => partsControllerCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts', 'inventory'] });
    },
  });

  const deletePart = useMutation({
    mutationFn: (id: string) => partsControllerRemove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts', 'inventory'] });
    },
  });

  return {
    parts: parts?.data || [],
    isLoading,
    createPart: createPart.mutateAsync,
    deletePart: deletePart.mutateAsync,
    isCreating: createPart.isPending,
    isDeleting: deletePart.isPending,
  };
}
