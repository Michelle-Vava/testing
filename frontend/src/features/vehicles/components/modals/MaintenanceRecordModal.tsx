import { useState } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/forms/FormField';
import { CreateMaintenanceRecordDto } from '@/services/generated/model';

interface MaintenanceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: CreateMaintenanceRecordDto) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Modal for adding new maintenance records to a vehicle
 * 
 * @example
 * ```tsx
 * <MaintenanceRecordModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onSubmit={handleAddRecord}
 *   isSubmitting={addRecordMutation.isPending}
 * />
 * ```
 */
export function MaintenanceRecordModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}: MaintenanceRecordModalProps) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Maintenance Record">
      <div className="space-y-4">
        <FormField
          id="date"
          label="Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        
        <FormField
          id="serviceType"
          label="Service Type"
          type="text"
          required
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          placeholder="e.g., Oil Change, Brake Service"
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Details about the service performed..."
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="cost"
            label="Cost ($)"
            type="number"
            min={0}
            step={0.01}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
          />
          <FormField
            id="mileage"
            label="Mileage"
            type="number"
            min={0}
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="e.g., 50000"
          />
        </div>

        <FormField
          id="provider"
          label="Provider Name"
          type="text"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          placeholder="e.g., Jiffy Lube, Dealer"
        />
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
