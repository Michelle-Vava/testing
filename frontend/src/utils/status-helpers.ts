/**
 * Status utility functions for consistent color coding across the application
 * 
 * Consolidates all status-related logic that was previously scattered
 * across multiple components and utils
 */

import { RequestStatus, JobStatus, QuoteStatus } from '@/types/enums';

// Re-export specific types if needed by consumers, or they should import from enums.ts
// For now, these types just alias the Enums to maintain compatibility if used elsewhere as type
export type { RequestStatus, JobStatus, QuoteStatus };
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
export function getRequestStatusColor(status: RequestStatus | string): string {
  const colors: Record<string, string> = {
    [RequestStatus.OPEN]: 'bg-blue-600 text-white',
    [RequestStatus.QUOTED]: 'bg-yellow-600 text-white',
    [RequestStatus.ACCEPTED]: 'bg-green-600 text-white',
    [RequestStatus.IN_PROGRESS]: 'bg-orange-600 text-white',
    [RequestStatus.COMPLETED]: 'bg-gray-600 text-white',
    [RequestStatus.CANCELLED]: 'bg-red-600 text-white',
  };

  return colors[status] || 'bg-gray-600 text-white';
}

/**
 * Get Tailwind color class for job status badges
 * 
 * @param status - The job status
 * @returns Tailwind className string for badge styling
 */
export function getJobStatusColor(status: JobStatus | string): string {
  const colors: Record<string, string> = {
    [JobStatus.PENDING]: 'bg-yellow-600 text-white',
    [JobStatus.IN_PROGRESS]: 'bg-blue-600 text-white',
    [JobStatus.COMPLETED]: 'bg-green-600 text-white',
    [JobStatus.CANCELLED]: 'bg-red-600 text-white',
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
 * Get Tailwind color class for urgency level badges (solid variant)
 * 
 * @param urgency - The urgency level
 * @returns Tailwind className string for badge styling
 */
export function getUrgencyColor(urgency: UrgencyLevel | string): string {
  const colors: Record<string, string> = {
    low: 'bg-green-600 text-white',
    medium: 'bg-yellow-600 text-white',
    high: 'bg-orange-600 text-white',
    urgent: 'bg-red-600 text-white',
  };

  return colors[urgency] || 'bg-gray-600 text-white';
}

/**
 * Get Tailwind color class for urgency level badges (light variant)
 * 
 * @param urgency - The urgency level
 * @returns Tailwind className string for light badge styling
 */
export function getUrgencyColorLight(urgency: string): string {
  const colors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-100 text-red-800',
  };

  return colors[urgency] || 'bg-gray-100 text-gray-800';
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
