import React from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useNavigate } from '@tanstack/react-router';

export const RoleSwitch: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.role) return null;

  const handleSwitch = () => {
    // No role selection needed - everyone is owner by default
    navigate({ to: '/owner/dashboard' });
  };

  const roleLabels = {
    owner: 'Vehicle Owner',
    provider: 'Service Provider',
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
      <span className="text-sm text-gray-600">Role:</span>
      <span className="text-sm font-medium text-gray-900">
        {roleLabels[user.role]}
      </span>
      <button
        onClick={handleSwitch}
        className="ml-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
      >
        Switch
      </button>
    </div>
  );
};
