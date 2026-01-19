import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { Shield, Key, Smartphone, Mail } from 'lucide-react';

/**
 * Security settings component
 * Shows sign-in methods and security options based on what user has enabled
 */
export function SecuritySettings() {
  const { user } = useUser();
  
  // Check what authentication methods the user has
  const hasPassword = user?.passwordEnabled || false;
  const hasGoogle = user?.externalAccounts?.some(acc => acc.provider === 'google') || false;
  const hasPhone = user?.phoneNumbers && user.phoneNumbers.length > 0;
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;
  const primaryPhone = user?.primaryPhoneNumber?.phoneNumber;

  return (
    <div className="space-y-6">
      {/* Sign-in Methods */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sign-in Methods</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage how you sign in to your account.
            </p>
          </div>
          
          <div className="space-y-3">
            {/* Email */}
            {primaryEmail && (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-gray-500">{primaryEmail}</div>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            )}

            {/* Phone */}
            {hasPhone && (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Phone Number</div>
                    <div className="text-sm text-gray-500">{primaryPhone || 'Verified'}</div>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            )}

            {/* Google */}
            {hasGoogle && (
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Google</div>
                    <div className="text-sm text-gray-500">Connected</div>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            )}

            {/* Password Status */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">Password</div>
                  <div className="text-sm text-gray-500">
                    {hasPassword ? 'Password is set' : 'Not set - you sign in with Google/Phone'}
                  </div>
                </div>
              </div>
              {!hasPassword && (
                <Button variant="outline" size="sm" disabled>
                  Add Password
                </Button>
              )}
            </div>
          </div>

          {hasPassword && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Change your password to keep your account secure
              </p>
              <Button variant="outline">
                Change Password
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-gray-700" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
              <p className="text-sm text-gray-500 mt-1">
                Additional security features for your account
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500 mt-1">
                  Add an extra layer of security to your account
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => user?.openUserProfile()}
              >
                Manage 2FA
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Active Sessions</div>
                <div className="text-sm text-gray-500 mt-1">
                  Manage and sign out of active sessions on other devices
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                View Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="outline" 
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            disabled
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
