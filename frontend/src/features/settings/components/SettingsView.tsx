import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SettingsTabs } from './SettingsTabs';
import { ProfileSettings } from './ProfileSettings';
import { AppPreferences } from './AppPreferences';
import { SecuritySettings } from './SecuritySettings';

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'security', label: 'Security' },
];

type TabId = 'profile' | 'preferences' | 'security';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <PageContainer maxWidth="4xl">
      <PageHeader title="Settings" />

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
