import { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { CreateMaintenanceRecordDto } from '@/api/generated/model';

interface MaintenanceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: CreateMaintenanceRecordDto) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal for adding new maintenance records
 */
export function MaintenanceRecordModal({ isOpen, onClose, onSubmit, isSubmitting }: MaintenanceRecordModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState('');
  const [cost, setCost] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSubmit = async () => {
    const record: CreateMaintenanceRecordDto = {
      serviceDate: new Date(date).toISOString(),
      serviceType,
      notes: description,
      performedBy: provider,
      cost: cost ? parseFloat(cost) : undefined,
      mileage: mileage ? parseInt(mileage) : undefined,
    };
    
    await onSubmit(record);
    
    // Reset form
    setServiceType('');
    setDescription('');
    setProvider('');
    setCost('');
    setMileage('');
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Maintenance Record">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            title="Service Date"
            placeholder="Select service date"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <input
            type="text"
            required
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            placeholder="e.g., Oil Change, Brake Service"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Details about the service performed..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mileage
            </label>
            <input
              type="number"
              min="0"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g., 50000"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider Name
          </label>
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g., Jiffy Lube, Dealer"
            className={inputClass}
          />
        </div>
      </div>
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Record'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
