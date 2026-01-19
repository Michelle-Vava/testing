import React from 'react';
import { formatShortDate } from '@/utils/formatters';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export interface TimelineStep {
  /** Step label */
  label: string;
  /** Step description or details */
  description?: string;
  /** ISO timestamp when this step occurred */
  timestamp?: string;
  /** Step status */
  status: 'completed' | 'current' | 'upcoming' | 'cancelled';
  /** Optional icon override */
  icon?: React.ReactNode;
}

export interface JobTimelineProps {
  /** Array of timeline steps in chronological order */
  steps: TimelineStep[];
  /** Whether to show vertical line between steps */
  showConnector?: boolean;
  /** Compact mode (smaller spacing) */
  compact?: boolean;
}

/**
 * Timeline component for displaying job progress
 * 
 * Features:
 * - Visual progress indicator
 * - Status-based coloring
 * - Timestamps for completed steps
 * - Flexible step configuration
 * - Works for both owner and provider views
 * 
 * @example
 * <JobTimeline
 *   steps={[
 *     { label: 'Request Submitted', status: 'completed', timestamp: '2024-01-01T10:00:00Z' },
 *     { label: 'Quote Received', status: 'completed', timestamp: '2024-01-01T12:00:00Z' },
 *     { label: 'Work in Progress', status: 'current' },
 *     { label: 'Completed', status: 'upcoming' }
 *   ]}
 * />
 */
export function JobTimeline({ steps, showConnector = true, compact = false }: JobTimelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          {/* Timeline Item */}
          <div className={`flex gap-4 ${compact ? 'pb-4' : 'pb-6'}`}>
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              <TimelineIcon status={step.status} icon={step.icon} />
              
              {/* Connector Line */}
              {showConnector && index < steps.length - 1 && (
                <div
                  className={`w-0.5 flex-1 ${
                    step.status === 'completed'
                      ? 'bg-green-300'
                      : step.status === 'cancelled'
                      ? 'bg-red-300'
                      : 'bg-gray-300'
                  } ${compact ? 'min-h-[20px]' : 'min-h-[30px]'}`}
                />
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between mb-1">
                <h4
                  className={`font-semibold ${
                    step.status === 'completed'
                      ? 'text-green-900'
                      : step.status === 'current'
                      ? 'text-blue-900'
                      : step.status === 'cancelled'
                      ? 'text-red-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </h4>
                {step.timestamp && (
                  <span className="text-sm text-gray-500">
                    {formatShortDate(step.timestamp)}
                  </span>
                )}
              </div>
              {step.description && (
                <p
                  className={`text-sm ${
                    step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Timeline step icon based on status
 */
function TimelineIcon({ status, icon }: { status: TimelineStep['status']; icon?: React.ReactNode }) {
  if (icon) {
    return <div className="w-8 h-8 flex items-center justify-center">{icon}</div>;
  }

  const iconClasses = "w-5 h-5";
  const containerClasses = `w-8 h-8 rounded-full flex items-center justify-center border-2 ${
    status === 'completed'
      ? 'bg-green-100 border-green-500 text-green-700'
      : status === 'current'
      ? 'bg-blue-100 border-blue-500 text-blue-700'
      : status === 'cancelled'
      ? 'bg-red-100 border-red-500 text-red-700'
      : 'bg-gray-100 border-gray-300 text-gray-400'
  }`;

  return (
    <div className={containerClasses}>
      {status === 'completed' && <CheckCircle className={iconClasses} />}
      {status === 'current' && <Clock className={iconClasses} />}
      {status === 'cancelled' && <XCircle className={iconClasses} />}
      {status === 'upcoming' && <AlertCircle className={iconClasses} />}
    </div>
  );
}

/**
 * Helper function to generate timeline steps from job data
 * 
 * @param job - Job data object
 * @returns Array of timeline steps
 * 
 * @example
 * const steps = generateJobTimelineSteps(job);
 * <JobTimeline steps={steps} />
 */
export function generateJobTimelineSteps(job: any): TimelineStep[] {
  const steps: TimelineStep[] = [];

  // Request created
  if (job.request?.createdAt) {
    steps.push({
      label: 'Request Submitted',
      description: job.request.title,
      timestamp: job.request.createdAt,
      status: 'completed',
    });
  }

  // Quote accepted
  if (job.quote?.createdAt) {
    steps.push({
      label: 'Quote Accepted',
      description: `Quote from ${job.provider?.name || 'provider'}`,
      timestamp: job.quote.createdAt,
      status: 'completed',
    });
  }

  // Job started
  if (job.startedAt) {
    steps.push({
      label: 'Work Started',
      timestamp: job.startedAt,
      status: 'completed',
    });
  }

  // Current status
  if (job.status === 'in_progress' && !job.completedAt) {
    steps.push({
      label: 'Work in Progress',
      description: 'Your vehicle is being serviced',
      status: 'current',
    });
  }

  // Job completed
  if (job.completedAt) {
    steps.push({
      label: 'Work Completed',
      timestamp: job.completedAt,
      status: 'completed',
    });
  }

  // Payment
  if (job.payment?.paidAt) {
    steps.push({
      label: 'Payment Received',
      timestamp: job.payment.paidAt,
      status: 'completed',
    });
  }

  // Cancelled
  if (job.status === 'cancelled') {
    steps.push({
      label: 'Job Cancelled',
      description: job.cancellationReason || 'Job was cancelled',
      timestamp: job.updatedAt,
      status: 'cancelled',
    });
  }

  // Future steps for in-progress jobs
  if (job.status === 'in_progress') {
    steps.push({
      label: 'Payment',
      status: 'upcoming',
    });
  }

  return steps;
}
