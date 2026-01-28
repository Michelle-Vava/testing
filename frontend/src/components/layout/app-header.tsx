import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ROUTES, getDashboardRoute, getOnboardingRoute } from '@/lib/routes';
import { UserRoles } from '@/lib/constants';
import type { UserRole } from '@/types/user';
import { getPrimaryRole, hasRole } from '@/features/auth/utils/auth-utils';

export const AppHeader: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showRolePicker, setShowRolePicker] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRolePicker(false);
    // Navigate to new dashboard
    const path = getDashboardRoute(newRole as any);
    navigate({ to: path });
  };

  if (!user) return null;

  const primaryRole = getPrimaryRole(user);

  const getDashboardPath = () => {
    if (!user.roles || user.roles.length === 0) return ROUTES.OWNER_DASHBOARD;
    if (!user.onboardingComplete) {
      return getOnboardingRoute(primaryRole as any);
    }
    return getDashboardRoute(primaryRole as any);
  };

  const roleLabels = {
    [UserRoles.OWNER]: 'Vehicle Owner',
    [UserRoles.PROVIDER]: 'Service Provider',
    [UserRoles.ADMIN]: 'Admin',
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={getDashboardPath()} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Service Connect</span>
            </div>
          </Link>

          {/* App Navigation */}
          <div className="flex items-center gap-4">
            {user.roles && user.roles.length > 0 && user.onboardingComplete && (
              <Link
                to={getDashboardPath()}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}

            {user.roles && user.roles.length > 0 && user.onboardingComplete && (
              <div className="relative">
                <button
                  onClick={() => setShowRolePicker(!showRolePicker)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-150 rounded-lg transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {roleLabels[primaryRole as keyof typeof roleLabels] || primaryRole}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showRolePicker ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Role Picker Dropdown */}
                {showRolePicker && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowRolePicker(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Switch Role</p>
                      </div>
                      <button
                        onClick={() => handleRoleSwitch(UserRoles.OWNER)}
                        className={`w-full px-3 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          primaryRole === UserRoles.OWNER ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">Vehicle Owner</p>
                          <p className="text-xs text-gray-500">Get quotes for repairs</p>
                        </div>
                        {primaryRole === UserRoles.OWNER && (
                          <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch(UserRoles.PROVIDER)}
                        className={`w-full px-3 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                          primaryRole === UserRoles.PROVIDER ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">Service Provider</p>
                          <p className="text-xs text-gray-500">Bid on repair jobs</p>
                        </div>
                        {primaryRole === UserRoles.PROVIDER && (
                          <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              {user.roles && user.roles.length > 0 && user.onboardingComplete && (
                <Link
                  to={ROUTES.OWNER_SETTINGS}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              )}
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
