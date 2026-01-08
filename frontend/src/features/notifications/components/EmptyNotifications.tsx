import { Bell } from 'lucide-react';

export function EmptyNotifications() {
  return (
    <div className="bg-white rounded-lg shadow p-12 text-center">
      <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No notifications
      </h3>
      <p className="text-gray-600">
        You're all caught up! Check back later for updates.
      </p>
    </div>
  );
}
