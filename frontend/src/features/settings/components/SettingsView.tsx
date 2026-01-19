import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { SettingsTabs } from './SettingsTabs';
import { ProfileSettings } from './ProfileSettings';
import { AppPreferences } from './AppPreferences';
import { SecuritySettings } from './SecuritySettings';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { User } from 'lucide-react';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'security', label: 'Security' },
];

type TabId = 'profile' | 'preferences' | 'security';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const { user } = useAuth();

  return (
    <PageContainer maxWidth="4xl">
      {/* Settings Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-300">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-500" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</h1>
            <p className="text-slate-600 text-sm">{user?.email}</p>
          </div>
        </div>
        <p className="text-slate-500 text-sm">Manage your account and preferences</p>
      </div>

      <SettingsTabs
        tabs={SETTINGS_TABS}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabId)}
      />

      {activeTab === 'profile' && <ProfileSettings />}
      {activeTab === 'preferences' && <AppPreferences />}
      {activeTab === 'security' && <SecuritySettings />}
    </PageContainer>
  );
}
