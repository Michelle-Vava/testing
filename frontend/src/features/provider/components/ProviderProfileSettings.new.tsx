import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, User as UserIcon, Bell } from 'lucide-react';
import { BusinessSettings } from './settings/BusinessSettings';
import { AccountSettings } from './settings/AccountSettings';
import { NotificationSettings } from './settings/NotificationSettings';

/**
 * Provider settings with tabbed navigation
 * 
 * LAYOUT:
 * ┌──────────────────────────────────┐
 * │ Settings                         │
 * ├──────────────────────────────────┤
 * │ [Business] [Account] [Notify]    │
 * ├──────────────────────────────────┤
 * │  <Active Tab Component>          │
 * └──────────────────────────────────┘
 */
export function ProviderProfileSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="business">
            <BusinessSettings />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
