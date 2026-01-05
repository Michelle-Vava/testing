import { Bell } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { customInstance } from '@/lib/axios';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => customInstance<{ count: number }>({
      url: '/notifications/unread-count',
      method: 'GET'
    })
  });
};

export function NotificationBell() {
  const navigate = useNavigate();
  const { data } = useNotifications();

  const unreadCount = data?.count || 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors outline-none"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full min-w-[20px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-slate-100">
          <h4 className="font-semibold text-slate-900">Notifications</h4>
        </div>
        <div className="p-6 text-center">
          {unreadCount === 0 ? (
            <div className="space-y-2">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900">No notifications yet</p>
              <p className="text-xs text-slate-500">
                You'll be notified when providers respond or jobs update.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                You have {unreadCount} unread notifications.
              </p>
              <button 
                onClick={() => navigate({ to: '/owner/notifications' })}
                className="text-sm text-primary-600 font-medium hover:underline"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
