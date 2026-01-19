import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActiveRequestCard } from '../cards/ActiveRequestCard';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

interface ActiveRequestsSectionProps {
  requests: any[];
  isLoading: boolean;
}

export function ActiveRequestsSection({ requests, isLoading }: ActiveRequestsSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Active Requests</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-32 bg-slate-100 rounded-lg"></div>
          <div className="h-32 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Filter for active requests only (open, in_progress, etc)
  // Assuming the API returns mixed status, or we filter here.
  // For now, assume all passed requests are relevant or sort them by status.
  const activeRequests = requests.filter(r => ['OPEN', 'IN_PROGRESS'].includes(r.status));

  if (activeRequests.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Active Requests</h2>
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                    <Plus className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No active requests</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                    Ready to schedule maintenance? create a new request to get quotes from local mechanics.
                </p>
                <Link to="/owner/requests/new" search={{ serviceType: undefined, providerId: undefined }}>
                    <Button variant="outline">Create Request</Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Active Requests</h2>
        <Link to="/owner/requests" className="text-sm font-medium text-yellow-600 hover:text-yellow-700">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {activeRequests.map((request) => (
          <ActiveRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
