import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  vehiclesControllerFindAll,
  vehiclesControllerCreate,
  vehiclesControllerFindOne,
  vehiclesControllerUpdate,
  vehiclesControllerDelete
} from '@/services/generated/vehicles/vehicles';
import { customInstance } from '@/lib/axios';
import type { VehiclesControllerFindAllParams } from '@/services/generated/model';
import type { Vehicle } from '@/features/vehicles/types/vehicle';

export function useVehicles(initialPage = 1, initialLimit = 20) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles', page, limit],
    queryFn: async () => {
      const params: VehiclesControllerFindAllParams = {
        page,
        limit
      };
      return await vehiclesControllerFindAll(params);
    },
  });

  // Orval returns AxiosResponse, so data is already the response payload
  // Backend returns { data: Vehicle[], meta: PaginationMeta }
  const responsePayload = (data as any) || {};
  const vehicles = (responsePayload?.data || []) as unknown as Vehicle[];
  const meta = responsePayload?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 };

  const createMutation = useMutation({
    mutationFn: (vehicleData: Omit<Vehicle, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => 
      vehiclesControllerCreate(vehicleData as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: vehicleData }: { id: string; data: Partial<Vehicle> }) => 
      vehiclesControllerUpdate(id, vehicleData as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => vehiclesControllerDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return {
    vehicles,
    meta,
    page,
    setPage,
    limit,
    isLoading,
    error,
    createVehicle: createMutation.mutateAsync,
    updateVehicle: updateMutation.mutateAsync,
    deleteVehicle: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useVehicle(id: string) {
  const queryClient = useQueryClient();
  
  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const result = await vehiclesControllerFindOne(id);
      return result as any;
    },
    enabled: !!id,
  });

  const updateMileageMutation = useMutation({
    mutationFn: (mileage: number) => 
      customInstance({
        url: `/vehicles/${id}/mileage`,
        method: 'PATCH',
        data: { mileage },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Vehicle>) => 
      vehiclesControllerUpdate(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles', id] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  return { 
    vehicle, 
    isLoading, 
    error,
    updateMileage: updateMileageMutation.mutateAsync,
    isUpdatingMileage: updateMileageMutation.isPending,
    updateVehicle: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
