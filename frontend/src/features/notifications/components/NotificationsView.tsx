import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '@/components/ui/skeleton-loaders';
import { useNotificationsControllerFindAll, useNotificationsControllerMarkAsRead, useNotificationsControllerMarkAllAsRead } from '@/services/generated/notifications/notifications';
import { NotificationList } from './NotificationList';
import { EmptyNotifications } from './EmptyNotifications';
import type { Notification } from '../types/notification';

export function NotificationsView() {
  const { data, isLoading } = useNotificationsControllerFindAll();
  const notifications = (data as unknown as Notification[]) || [];
  
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
        <div className="space-y-4">
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
          <CardSkeleton lines={2} />
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
