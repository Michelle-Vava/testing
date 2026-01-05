import { createFileRoute } from '@tanstack/react-router';
import { Bell, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export const Route = createFileRoute('/owner/_layout/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  // Placeholder - will be replaced with actual Orval hooks
  const notifications: any[] = [];
  const isLoading = false;

  const handleMarkAsRead = (id: string) => {
    console.log('Mark as read:', id);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        {notifications.length > 0 && (
          <Button variant="ghost" onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No notifications
          </h3>
          <p className="text-slate-600">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y divide-slate-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-slate-50 transition-colors ${
                !notification.isRead ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    !notification.isRead ? 'bg-yellow-500' : 'bg-transparent'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
