import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useNotificationsControllerFindAll, useNotificationsControllerMarkAsRead, useNotificationsControllerMarkAllAsRead } from '@/api/generated/notifications/notifications';
import { NotificationList } from './NotificationList';
import { EmptyNotifications } from './EmptyNotifications';

export function NotificationsView() {
  const { data: notifications = [], isLoading } = useNotificationsControllerFindAll();
  const { mutate: markAsRead } = useNotificationsControllerMarkAsRead();
  const { mutate: markAllAsRead } = useNotificationsControllerMarkAllAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead({ id });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead({});
  };

  if (isLoading) {
    return (
      <PageContainer maxWidth="4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="4xl">
      <PageHeader
        title="Notifications"
        actions={
          notifications.length > 0 ? (
            <Button variant="ghost" onClick={handleMarkAllAsRead}>
              Mark All Read
            </Button>
          ) : null
        }
      />

      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
        />
      )}
    </PageContainer>
  );
}
