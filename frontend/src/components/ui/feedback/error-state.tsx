import { Card, CardContent } from '../card';
import { Button } from '../button';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  /** Error title/heading */
  title?: string;
  /** Error description message */
  message: string;
  /** Optional retry callback */
  onRetry?: () => void;
  /** Custom retry button text */
  retryText?: string;
  /** Whether to wrap in a Card (default: true) */
  useCard?: boolean;
}

/**
 * Displays an error message with optional retry action
 * 
 * @example
 * <ErrorState 
 *   message="Failed to load vehicle" 
 *   onRetry={() => refetch()} 
 * />
 * 
 * @example
 * <ErrorState 
 *   title="Access Denied"
 *   message="You don't have permission to view this resource"
 *   useCard={false}
 * />
 */
export function ErrorState({ 
  title = 'Something went wrong',
  message, 
  onRetry,
  retryText = 'Try Again',
  useCard = true 
}: ErrorStateProps) {
  const content = (
    <div className="text-center py-12 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryText}
        </Button>
      )}
    </div>
  );

  if (!useCard) {
    return content;
  }

  return (
    <Card>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
