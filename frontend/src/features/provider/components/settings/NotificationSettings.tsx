import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell } from 'lucide-react';

/**
 * Notification Settings - User notification preferences
 * 
 * STATUS: Placeholder component
 * TODO: Implement email/SMS/push notification preferences
 */
export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
          <Bell className="w-12 h-12 mb-4 text-gray-300" />
          <p>Notification settings are coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
