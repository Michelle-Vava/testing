import { describe, it, expect } from 'vitest';
import { 
  getRequestStatusColor, 
  getJobStatusColor, 
  getQuoteStatusColor,
  getUrgencyColor,
  getStatusText,
  getStatusIcon,
  isActiveStatus,
  isFinalStatus
} from '../status-helpers';

describe('Status Helpers', () => {
    describe('getRequestStatusColor', () => {
        it('returns correct colors for known statuses', () => {
            expect(getRequestStatusColor('open')).toContain('bg-blue-600');
            expect(getRequestStatusColor('quoted')).toContain('bg-yellow-600');
            expect(getRequestStatusColor('accepted')).toContain('bg-green-600');
            expect(getRequestStatusColor('cancelled')).toContain('bg-red-600');
        });

        it('returns default color for unknown status', () => {
            expect(getRequestStatusColor('unknown' as any)).toContain('bg-gray-600');
        });
    });

    describe('getJobStatusColor', () => {
        it('returns correct colors for known statuses', () => {
            expect(getJobStatusColor('pending')).toContain('bg-yellow-600');
            expect(getJobStatusColor('in_progress')).toContain('bg-blue-600');
            expect(getJobStatusColor('completed')).toContain('bg-green-600');
        });
    });

    describe('getQuoteStatusColor', () => {
        it('returns correct colors for known statuses', () => {
            expect(getQuoteStatusColor('pending')).toContain('bg-yellow-600');
            expect(getQuoteStatusColor('accepted')).toContain('bg-green-600');
            expect(getQuoteStatusColor('rejected')).toContain('bg-gray-600');
        });
    });

    describe('getStatusText', () => {
        it('converts snake_case to Title Case', () => {
            expect(getStatusText('in_progress', 'job')).toBe('In Progress');
            expect(getStatusText('completed', 'job')).toBe('Completed');
            expect(getStatusText('provider_approval_needed', 'request')).toBe('Provider Approval Needed');
        });
    });

    describe('getStatusIcon', () => {
        it('returns CheckCircle for completion/success', () => {
            expect(getStatusIcon('completed', 'job')).toBe('CheckCircle');
            expect(getStatusIcon('accepted', 'quote')).toBe('CheckCircle');
        });
        
        it('returns XCircle for failure/rejection', () => {
            expect(getStatusIcon('cancelled', 'job')).toBe('XCircle');
            expect(getStatusIcon('rejected', 'quote')).toBe('XCircle');
        });

        it('returns Clock for pending/in-progress', () => {
            expect(getStatusIcon('in_progress', 'job')).toBe('Clock');
            expect(getStatusIcon('pending', 'job')).toBe('Clock');
        });
    });

    describe('Logic Predicates', () => {
        it('isActiveStatus identifies active statuses correctly', () => {
            expect(isActiveStatus('open')).toBe(true);
            expect(isActiveStatus('in_progress')).toBe(true);
            expect(isActiveStatus('cancelled')).toBe(false);
            expect(isActiveStatus('completed')).toBe(false);
        });

        it('isFinalStatus identifies final statuses correctly', () => {
            expect(isFinalStatus('completed')).toBe(true);
            expect(isFinalStatus('cancelled')).toBe(true);
            expect(isFinalStatus('rejected')).toBe(true);
            expect(isFinalStatus('open')).toBe(false);
        });
    });
});
