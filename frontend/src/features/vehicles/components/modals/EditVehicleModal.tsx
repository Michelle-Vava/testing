import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/forms/FormField';
import { Vehicle } from '@/features/vehicles/types/vehicle';

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  onUpdate: (data: Partial<Vehicle>) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Modal for editing vehicle details
 */
export function EditVehicleModal({ 
  isOpen, 
  onClose, 
  vehicle, 
  onUpdate, 
  isUpdating 
}: EditVehicleModalProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        color: vehicle.color || '',
        licensePlate: vehicle.licensePlate || '',
      });
    }
  }, [vehicle, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      ...formData,
      year: parseInt(formData.year),
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Vehicle">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="year"
            name="year"
            label="Year"
            type="number"
            required
            value={formData.year}
            onChange={handleChange}
          />
          <FormField
            id="make"
            name="make"
            label="Make"
            type="text"
            required
            value={formData.make}
            onChange={handleChange}
          />
        </div>

        <FormField
          id="model"
          name="model"
          label="Model"
          type="text"
          required
          value={formData.model}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="color"
            name="color"
            label="Color"
            type="text"
            required
            value={formData.color}
            onChange={handleChange}
          />
          <FormField
            id="licensePlate"
            name="licensePlate"
            label="License Plate"
            type="text"
            required
            value={formData.licensePlate}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
