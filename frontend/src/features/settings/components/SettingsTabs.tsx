/**
 * Reusable tabs component for settings page
 */
export interface Tab {
  id: string;
  label: string;
}

export interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="flex gap-4 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
