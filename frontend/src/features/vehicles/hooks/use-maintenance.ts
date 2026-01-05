import { useQueryClient } from '@tanstack/react-query';
import {
  useMaintenanceControllerFindAll,
  useMaintenanceControllerCreate,
  useMaintenanceControllerDelete,
  getMaintenanceControllerFindAllQueryKey,
} from '@/api/generated/maintenance/maintenance';
import { CreateMaintenanceRecordDto } from '@/api/generated/model';

export const useMaintenance = (vehicleId: string) => {
  const queryClient = useQueryClient();

  const { data: maintenanceRecords, isLoading, error } = useMaintenanceControllerFindAll(vehicleId, {
    query: {
      enabled: !!vehicleId,
    },
  });

  const { mutateAsync: createRecordMutation, isPending: isCreating } = useMaintenanceControllerCreate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getMaintenanceControllerFindAllQueryKey(vehicleId),
        });
      },
    },
  });

  const { mutateAsync: deleteRecordMutation, isPending: isDeleting } = useMaintenanceControllerDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getMaintenanceControllerFindAllQueryKey(vehicleId),
        });
      },
    },
  });

  const createRecord = (data: CreateMaintenanceRecordDto) => {
    return createRecordMutation({ vehicleId, data });
  };

  const deleteRecord = (id: string) => {
    return deleteRecordMutation({ id });
  };

  return {
    maintenanceRecords,
    isLoading,
    error,
    createRecord,
    isCreating,
    deleteRecord,
    isDeleting,
  };
};
