import { Modal, ModalFooter } from './modal';
import { Button } from './button';
import { ReactNode } from 'react';

interface ConfirmationModalProps {
  /** Modal visibility state */
  isOpen: boolean;
  /** Close modal callback */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Confirmation message content (can be string or JSX) - use either message or children */
  message?: ReactNode;
  /** Children content (alternative to message prop) */
  children?: ReactNode;
  /** Confirm action callback */
  onConfirm: () => void | Promise<void>;
  /** Cancel action callback (default: onClose) */
  onCancel?: () => void;
  /** Custom confirm button text */
  confirmText?: string;
  /** Custom cancel button text */
  cancelText?: string;
  /** Button variant for confirm action */
  confirmVariant?: 'primary' | 'danger' | 'outline' | 'secondary' | 'ghost';
  /** Whether confirm action is loading */
  isLoading?: boolean;
  /** Loading text to show during confirm */
  loadingText?: string;
}

/**
 * Reusable confirmation dialog with customizable actions
 * 
 * @example
 * <ConfirmationModal
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   title="Delete Vehicle?"
 *   message="Are you sure you want to delete this vehicle? This action cannot be undone."
 *   onConfirm={handleDelete}
 *   confirmText="Delete"
 *   confirmVariant="danger"
 *   isLoading={isDeleting}
 * />
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  isLoading = false,
  loadingText
}: ConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Use either children or message prop
  const content = children || message;

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} title={title}>
      <div className="text-gray-700 mb-4">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      <ModalFooter>
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button 
          variant={confirmVariant}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (loadingText || `${confirmText}...`) : confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
