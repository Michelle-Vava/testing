import { useNavigate, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useVehicle } from '@/features/vehicles/hooks/use-vehicles';
import { useMaintenance } from '@/features/vehicles/hooks/use-maintenance';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useToast } from '@/contexts/ToastContext';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { VehicleSpecs } from './VehicleSpecs';
import { QuickActions } from './QuickActions';
import { MaintenanceHistory } from './MaintenanceHistory';
import { MileageUpdateModal } from './MileageUpdateModal';
import { MaintenanceRecordModal } from './MaintenanceRecordModal';
import { EditVehicleModal } from './EditVehicleModal';
import { ImageUpload } from '@/features/upload/components/ImageUpload';
import { ImageGallery } from '@/features/upload/components/ImageGallery';
import { CreateMaintenanceRecordDto } from '@/api/generated/model';
import { Vehicle } from '@/features/vehicles/types/vehicle';

interface VehicleDetailProps {
  vehicleId: string;
}

export function VehicleDetail({ vehicleId }: VehicleDetailProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const { vehicle, isLoading, error, updateMileage, isUpdatingMileage, updateVehicle, isUpdating: isUpdatingVehicle } = useVehicle(vehicleId);
  const { maintenanceRecords, isLoading: isLoadingMaintenance, createRecord, isCreating, error: maintenanceError } = useMaintenance(vehicleId);
  const { uploadImages, deleteImage, isUploading, isDeleting } = useImageUpload();
  
  console.log('VehicleDetail maintenance:', { maintenanceRecords, isLoadingMaintenance, maintenanceError });

  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImagesSelected = async (files: File[]) => {
    try {
      await uploadImages({
        entityId: vehicleId,
        entityType: 'vehicle',
        files,
      });
      setShowImageUpload(false);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleImageRemove = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      await deleteImage({
        entityId: vehicleId,
        entityType: 'vehicle',
        imageUrl,
      });
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const handleUpdateMileage = async (mileage: number) => {
    try {
      await updateMileage(mileage);
      toast.success('Mileage updated successfully');
      setShowMileageModal(false);
    } catch (error) {
      toast.error('Failed to update mileage');
    }
  };

  const handleUpdateVehicle = async (data: Partial<Vehicle>) => {
    try {
      await updateVehicle(data);
      toast.success('Vehicle updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update vehicle');
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
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/owner/vehicles" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to My Vehicles
        </Link>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <Link to="/owner/vehicles" className="hover:text-gray-900">My Vehicles</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>
      </div>

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
          onEditVehicle={() => setShowEditModal(true)}
        />
      </div>

      {/* Vehicle Images */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vehicle Photos</CardTitle>
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showImageUpload ? 'Cancel' : 'Add Photos'}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {showImageUpload && (
            <div className="mb-6">
              <ImageUpload
                images={vehicle.imageUrls || []}
                onImagesSelected={handleImagesSelected}
                onImageRemove={handleImageRemove}
                maxImages={10}
                isLoading={isUploading || isDeleting}
              />
            </div>
          )}
          
          {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
            <ImageGallery
              images={vehicle.imageUrls}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          ) : (
            !showImageUpload && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">No photos yet</p>
                <button
                  onClick={() => setShowImageUpload(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first photo
                </button>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Maintenance History */}
      <MaintenanceHistory
        records={Array.isArray(maintenanceRecords) ? maintenanceRecords : []}
        isLoading={isLoadingMaintenance}
        error={maintenanceError as Error}
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

      {vehicle && (
        <EditVehicleModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          vehicle={vehicle}
          onUpdate={handleUpdateVehicle}
          isUpdating={isUpdatingVehicle}
        />
      )}
    </div>
  );
}
