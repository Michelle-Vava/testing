import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface RequestConfirmationModalProps {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RequestConfirmationModal({ 
  isOpen, 
  isCreating,
  onClose, 
  onConfirm 
}: RequestConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Your Request?"
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          Your request will be sent to verified mechanics near you. Here's what happens next:
        </p>
        
        <AlertBox variant="neutral" className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Request posted</p>
              <p className="text-sm text-gray-600">Mechanics in your area receive your request</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Quotes arrive (typically 2-4 hours)</p>
              <p className="text-sm text-gray-600">You'll get notified as each quote comes in</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Compare and choose</p>
              <p className="text-sm text-gray-600">Accept the quote that fits your needs best</p>
            </div>
          </div>
        </AlertBox>

        <AlertBox variant="success" icon={<CheckCircle className="w-5 h-5" />} className="text-sm">
          <div>
            <p className="font-medium">No spam. No obligation.</p>
            <p>You're in complete control. Review quotes and only book if you want to.</p>
          </div>
        </div>
      </div>
      
      <ModalFooter>
        <Button variant="outline" onClick={onClose} disabled={isCreating}>
          Review Request
        </Button>
        <Button onClick={onConfirm} disabled={isCreating}>
          {isCreating ? 'Posting Request...' : 'Post Request'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
