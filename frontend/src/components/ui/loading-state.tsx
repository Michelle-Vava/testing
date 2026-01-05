import { Card, CardContent } from './card';

interface LoadingStateProps {
  /** Custom loading message to display */
  message?: string;
  /** Whether to show the animated spinner */
  showSpinner?: boolean;
  /** Whether to wrap in a Card (default: true) */
  useCard?: boolean;
}

/**
 * Displays a centered loading message with optional spinner
 * 
 * @example
 * <LoadingState message="Loading vehicle details..." />
 * 
 * @example
 * <LoadingState showSpinner={false} useCard={false} />
 */
export function LoadingState({ 
  message = 'Loading...', 
  showSpinner = true,
  useCard = true 
}: LoadingStateProps) {
  const content = (
    <div className="text-center py-12">
      {showSpinner && (
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
      )}
      <p className="text-gray-500">{message}</p>
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
