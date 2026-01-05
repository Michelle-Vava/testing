/**
 * Status utility functions for consistent color coding across the application
 * 
 * Consolidates all status-related logic that was previously scattered
 * across multiple components and utils
 */

// Status types
export type RequestStatus = 'open' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type QuoteStatus = 'pending' | 'accepted' | 'rejected';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Get Tailwind color class for request status badges
 * 
 * @param status - The request status
 * @returns Tailwind className string for badge styling
 * 
 * @example
 * <Badge className={getRequestStatusColor('open')}>Open</Badge>
 */
export function getRequestStatusColor(status: RequestStatus): string {
  const colors: Record<RequestStatus, string> = {
    open: 'bg-blue-600 text-white',
    quoted: 'bg-yellow-600 text-white',
    accepted: 'bg-green-600 text-white',
    in_progress: 'bg-orange-600 text-white',
    completed: 'bg-gray-600 text-white',
    cancelled: 'bg-red-600 text-white',
  };

  return colors[status] || 'bg-gray-600 text-white';
}

/**
 * Get Tailwind color class for job status badges
 * 
 * @param status - The job status
 * @returns Tailwind className string for badge styling
 */
export function getJobStatusColor(status: JobStatus): string {
  const colors: Record<JobStatus, string> = {
    pending: 'bg-yellow-600 text-white',
    in_progress: 'bg-blue-600 text-white',
    completed: 'bg-green-600 text-white',
    cancelled: 'bg-red-600 text-white',
  };

  return colors[status] || 'bg-gray-600 text-white';
}

/**
 * Get Tailwind color class for quote status badges
 * 
 * @param status - The quote status
 * @returns Tailwind className string for badge styling
 */
export function getQuoteStatusColor(status: QuoteStatus): string {
  const colors: Record<QuoteStatus, string> = {
    pending: 'bg-yellow-600 text-white',
    accepted: 'bg-green-600 text-white',
    rejected: 'bg-gray-600 text-white',
  };

  return colors[status] || 'bg-gray-600 text-white';
}

/**
 * Get Tailwind color class for urgency level badges
 * 
 * @param urgency - The urgency level
 * @returns Tailwind className string for badge styling
 */
export function getUrgencyColor(urgency: UrgencyLevel): string {
  const colors: Record<UrgencyLevel, string> = {
    low: 'bg-green-600 text-white',
    medium: 'bg-yellow-600 text-white',
    high: 'bg-orange-600 text-white',
    urgent: 'bg-red-600 text-white',
  };

  return colors[urgency] || 'bg-gray-600 text-white';
}

/**
 * Get human-readable display text for status values
 * 
 * Converts database status values (snake_case) to user-friendly text
 * 
 * @param status - The status value
 * @param type - The status type (job, request, quote)
 * @returns Human-readable status text
 * 
 * @example
 * getStatusText('in_progress', 'job') // Returns "In Progress"
 */
export function getStatusText(status: string, _type: 'job' | 'request' | 'quote'): string {
  // Convert snake_case to Title Case
  const formatted = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return formatted;
}

/**
 * Get icon name for status (for use with lucide-react)
 * 
 * @param status - The status value
 * @param type - The status type
 * @returns Icon component name
 */
export function getStatusIcon(status: string, _type: 'job' | 'request' | 'quote'): string {
  if (status === 'completed') return 'CheckCircle';
  if (status === 'cancelled' || status === 'rejected') return 'XCircle';
  if (status === 'in_progress') return 'Clock';
  if (status === 'pending' || status === 'open') return 'Clock';
  if (status === 'accepted') return 'CheckCircle';
  
  return 'Circle';
}

/**
 * Determine if a status is considered "active" (not final)
 * 
 * @param status - The status value
 * @returns true if status is active/ongoing
 */
export function isActiveStatus(status: string): boolean {
  return ['open', 'quoted', 'accepted', 'in_progress', 'pending'].includes(status);
}

/**
 * Determine if a status is considered "final" (completed or cancelled)
 * 
 * @param status - The status value
 * @returns true if status is final
 */
export function isFinalStatus(status: string): boolean {
  return ['completed', 'cancelled', 'rejected'].includes(status);
}
