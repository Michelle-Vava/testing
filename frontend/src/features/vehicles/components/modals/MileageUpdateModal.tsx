import { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/forms/FormField';

interface MileageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMileage: number;
  onUpdate: (mileage: number) => Promise<void>;
  isUpdating: boolean;
}

/**
 * Modal for updating vehicle mileage
 */
export function MileageUpdateModal({ 
  isOpen, 
  onClose, 
  currentMileage, 
  onUpdate, 
  isUpdating 
}: MileageUpdateModalProps) {
  const [mileage, setMileage] = useState(currentMileage?.toString() || '');

  const handleUpdate = async () => {
    const parsedMileage = parseInt(mileage);
    if (!isNaN(parsedMileage) && parsedMileage >= 0) {
      await onUpdate(parsedMileage);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Mileage">
      <div className="space-y-4">
        <FormField
          id="mileage"
          label="Current Mileage (km)"
          type="number"
          min={0}
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder="Enter current mileage"
        />
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
