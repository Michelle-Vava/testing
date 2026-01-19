import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { customInstance } from '@/lib/axios';
import { getPrimaryRole, getUserRoles } from '@/features/auth/utils/auth-utils';
import { useQueryClient } from '@tanstack/react-query';

export function RoleSwitcher() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const userRoles = getUserRoles(user);
  const primaryRole = getPrimaryRole(user);

  // Only show switcher if user has multiple roles
  if (userRoles.length <= 1) {
    return null;
  }

  const handleRoleSwitch = async (newRole: string) => {
    if (newRole === primaryRole || isLoading) return;

    setIsLoading(true);
    try {
      // Call backend to reorder roles array
      await customInstance.put('/auth/set-primary-role', {
        primaryRole: newRole
      });

      // Invalidate user query to refetch with new role order
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      // Redirect to appropriate dashboard
      const redirectPath = newRole === 'owner' ? '/owner' : '/providers';
      window.location.href = redirectPath;
    } catch (error) {
      console.error('Failed to switch role:', error);
      alert('Failed to switch role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Switch to:</span>
      <select
        value={primaryRole}
        onChange={(e) => handleRoleSwitch(e.target.value)}
        disabled={isLoading}
        className="rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
      >
        {userRoles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      )}
    </div>
  );
}
