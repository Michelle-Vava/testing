import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SettingsTabs } from '@/features/settings/components/SettingsTabs';
import { ProfileSettings } from '@/features/settings/components/ProfileSettings';
import { AppPreferences } from '@/features/settings/components/AppPreferences';
import { SecuritySettings } from '@/features/settings/components/SecuritySettings';

export const Route = createFileRoute('/owner/settings')({
  component: SettingsPage,
});

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'security', label: 'Security' },
];

type TabId = 'profile' | 'preferences' | 'security';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Tabs Navigation */}
        <SettingsTabs
          tabs={SETTINGS_TABS}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        />

        {/* Tab Content */}
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'preferences' && <AppPreferences />}
        {activeTab === 'security' && <SecuritySettings />}
      </div>
    </div>
  );
}
