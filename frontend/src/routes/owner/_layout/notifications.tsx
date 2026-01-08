import { createFileRoute } from '@tanstack/react-router';
import { NotificationsView } from '@/features/notifications/components/NotificationsView';

export const Route = createFileRoute('/owner/_layout/notifications')({
  component: NotificationsView,
});
