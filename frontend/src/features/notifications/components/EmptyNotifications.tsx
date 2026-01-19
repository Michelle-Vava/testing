import { Bell } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export function EmptyNotifications() {
  return (
    <div className="bg-white rounded-lg shadow p-12">
      <EmptyState
        icon={<Bell className="h-16 w-16" />}
        title="No notifications"
        description="You're all caught up! Check back later for updates."
      />
    </div>
  );
}
