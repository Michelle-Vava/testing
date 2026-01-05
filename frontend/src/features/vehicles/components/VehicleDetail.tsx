import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useVehicle } from '@/features/vehicles/hooks/use-vehicles';
import { useMaintenance } from '@/features/vehicles/hooks/use-maintenance';
import { useToast } from '@/contexts/ToastContext';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { VehicleSpecs } from './VehicleSpecs';
import { QuickActions } from './QuickActions';
import { MaintenanceHistory } from './MaintenanceHistory';
import { MileageUpdateModal } from './MileageUpdateModal';
import { MaintenanceRecordModal } from './MaintenanceRecordModal';
import { CreateMaintenanceRecordDto } from '@/api/generated/model';

interface VehicleDetailProps {
  vehicleId: string;
}

export function VehicleDetail({ vehicleId }: VehicleDetailProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const { vehicle, isLoading, error, updateMileage, isUpdatingMileage } = useVehicle(vehicleId);
  const { maintenanceRecords, isLoading: isLoadingMaintenance, createRecord, isCreating } = useMaintenance(vehicleId);
  
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const handleUpdateMileage = async (mileage: number) => {
    try {
      await updateMileage(mileage);
      toast.success('Mileage updated successfully');
      setShowMileageModal(false);
    } catch (error) {
      toast.error('Failed to update mileage');
    }
  };

  const handleAddMaintenance = async (record: CreateMaintenanceRecordDto) => {
    try {
      await createRecord(record);
      toast.success('Maintenance record added successfully');
      setShowMaintenanceModal(false);
    } catch (error) {
      console.error('Failed to add maintenance record:', error);
      toast.error('Failed to add maintenance record');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading vehicle..." />;
  }

  if (error || !vehicle) {
    return <ErrorState title="Vehicle not found" message="The vehicle you're looking for doesn't exist." />;
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>
        <p className="text-gray-600">{vehicle.licensePlate} • {vehicle.color}</p>
      </div>

      {/* Vehicle Details & Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <VehicleSpecs vehicle={vehicle} />
        <QuickActions
          vehicleId={vehicleId}
          currentMileage={vehicle.mileage}
          onCreateRequest={() => navigate({ to: '/owner/requests/new', search: { vehicleId } as any })}
          onUpdateMileage={() => {
            setShowMileageModal(true);
          }}
          onAddMaintenance={() => setShowMaintenanceModal(true)}
        />
      </div>

      {/* Maintenance History */}
      <MaintenanceHistory
        records={Array.isArray(maintenanceRecords) ? maintenanceRecords : []}
        isLoading={isLoadingMaintenance}
        onAddRecord={() => setShowMaintenanceModal(true)}
      />

      {/* Modals */}
      <MileageUpdateModal
        isOpen={showMileageModal}
        onClose={() => setShowMileageModal(false)}
        currentMileage={vehicle.mileage || 0}
        onUpdate={handleUpdateMileage}
        isUpdating={isUpdatingMileage}
      />

      <MaintenanceRecordModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onSubmit={handleAddMaintenance}
        isSubmitting={isCreating}
      />
    </div>
  );
}
