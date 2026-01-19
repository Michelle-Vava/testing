import { Clock } from 'lucide-react';
import { useActivitiesControllerFindAll } from '@/services/generated/activities/activities';
import { formatDistanceToNow } from 'date-fns';

const useActivities = () => {
  return useActivitiesControllerFindAll({ limit: 5 });
};

export function ActivityFeed() {
  const { data: activities, isLoading } = useActivities();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <ListSkeleton items={3} />
      </div>
    );
  }

  if (!activities || (activities as any).length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <EmptyState
          icon={<Clock className="h-12 w-12" />}
          title="No activity yet"
          description="When you request a service, updates from providers will appear here. Quotes, messages, and bookings are tracked here."
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {(activities as any[]).slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-1">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
