import { Badge } from './badge';
import { 
  getRequestStatusColor, 
  getJobStatusColor, 
  getQuoteStatusColor, 
  getUrgencyColor,
  getStatusText 
} from '@/shared/utils/status-helpers';

type StatusType = 'job' | 'request' | 'quote' | 'urgency';

interface StatusBadgeProps {
  /** Status value to display */
  status: string;
  /** Type of status determines color scheme */
  type: StatusType;
  /** Optional custom class names */
  className?: string;
}

/**
 * Displays status with consistent color coding across the app
 * 
 * @example
 * <StatusBadge status="in_progress" type="job" />
 * <StatusBadge status="high" type="urgency" />
 * <StatusBadge status="pending" type="quote" />
 */
export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const colorClass = getStatusColorClass(status, type);
  const displayText = formatStatusText(status);

  return (
    <Badge className={`${colorClass} ${className || ''}`}>
      {displayText}
    </Badge>
  );
}

/**
 * Get color class based on status and type
 * Converts hex/rgb colors to Tailwind classes
 */
function getStatusColorClass(status: string, type: StatusType): string {
  switch (type) {
    case 'job':
      return convertToTailwindClass(getJobStatusColor(status as any));
    case 'request':
      return convertToTailwindClass(getRequestStatusColor(status as any));
    case 'quote':
      return convertToTailwindClass(getQuoteStatusColor(status as any));
    case 'urgency':
      return convertToTailwindClass(getUrgencyColor(status as any));
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Convert color strings to Tailwind badge classes
 */
function convertToTailwindClass(colorString: string): string {
  // Map the helper function colors to badge-friendly classes
  if (colorString.includes('blue-600')) return 'bg-blue-100 text-blue-800';
  if (colorString.includes('green-600')) return 'bg-green-100 text-green-800';
  if (colorString.includes('yellow-600')) return 'bg-yellow-100 text-yellow-800';
  if (colorString.includes('orange-600')) return 'bg-orange-100 text-orange-800';
  if (colorString.includes('red-600')) return 'bg-red-100 text-red-800';
  if (colorString.includes('purple-600')) return 'bg-purple-100 text-purple-800';
  if (colorString.includes('gray-600')) return 'bg-gray-100 text-gray-800';
  
  return 'bg-gray-100 text-gray-800';
}

/**
 * Format status text for display (replace underscores, capitalize)
 */
function formatStatusText(status: string): string {
  return getStatusText(status, 'job'); // Type doesn't matter for formatting
}

