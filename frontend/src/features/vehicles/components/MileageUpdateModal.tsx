import { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

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
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
            Current Mileage (km)
          </label>
          <input
            id="mileage"
            type="number"
            min="0"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter current mileage"
            title="Current Mileage"
          />
        </div>
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
