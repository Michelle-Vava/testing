import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import type { Notification } from '../types/notification';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: notifications.length,
    estimateSize: () => 80, // Estimate height of a notification item
    overscan: 5,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <div ref={parentRef} className="bg-white rounded-lg shadow divide-y divide-slate-200">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const notification = notifications[virtualItem.index];
          if (!notification) return null; // Safety check

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className={`p-4 hover:bg-slate-50 transition-colors ${
                !notification.isRead ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    !notification.isRead ? 'bg-yellow-500' : 'bg-transparent'
                  }`}
                  aria-hidden="true"
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
                    aria-label={`Mark notification "${notification.title}" as read`}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

