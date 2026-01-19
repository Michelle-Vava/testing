import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { formatShortDate } from '@/utils/formatters';

interface JobTimelineCardProps {
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export function JobTimelineCard({ createdAt, startedAt, completedAt }: JobTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Quote Accepted</p>
              <p className="text-sm text-gray-500">{formatShortDate(createdAt)}</p>
            </div>
          </div>

          {startedAt && (
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Work Started</p>
                <p className="text-sm text-gray-500">{formatShortDate(startedAt)}</p>
              </div>
            </div>
          )}

          {completedAt && (
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Job Completed</p>
                <p className="text-sm text-gray-500">{formatShortDate(completedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
