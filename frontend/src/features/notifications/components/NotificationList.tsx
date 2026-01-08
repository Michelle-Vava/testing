import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  return (
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
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
