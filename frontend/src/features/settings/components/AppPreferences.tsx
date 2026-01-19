import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/ToastContext';
import { useUIStore } from '@/lib/store';

/**
 * App preferences component
 * Includes theme selection and notification toggles
 */
export function AppPreferences() {
  const toast = useToast();
  const { theme, setTheme } = useUIStore();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">App Preferences</h2>
            <p className="text-sm text-gray-500 mt-1">
              Customize your experience and notification settings.
            </p>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Light</div>
                    <div className="text-sm text-gray-500">Default theme</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Dark</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Midnight Navy</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
          
          <div className="space-y-4">
            <NotificationToggle
              title="Email Notifications"
              description="Receive updates about your requests"
              defaultChecked
            />
            <NotificationToggle
              title="Quote Notifications"
              description="Alert when you receive new quotes"
              defaultChecked
            />
            <NotificationToggle
              title="Marketing Emails"
              description="Tips, offers, and product updates"
              defaultChecked={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Reusable notification toggle component
 */
function NotificationToggle({ 
  title, 
  description, 
  defaultChecked 
}: { 
  title: string; 
  description: string; 
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          defaultChecked={defaultChecked} 
          className="sr-only peer" 
          aria-label={`Enable ${title.toLowerCase()}`} 
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
      </label>
    </div>
  );
}
