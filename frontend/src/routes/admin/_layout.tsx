import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/sidebar';
import { LayoutDashboard, Users, Settings, Activity } from 'lucide-react';

export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: ({ context: _context }) => {
    // We can't use hooks here, so we rely on the auth context passed or check localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw redirect({ to: '/auth/login' });
    }
    
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        // Redirect non-admins to their respective dashboards
        if (user.role === 'provider') {
          throw redirect({ to: '/provider/dashboard' });
        } else {
          throw redirect({ to: '/owner/dashboard' });
        }
      }
    } catch (e) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const sidebarLinks = [
    {
      to: '/admin/dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: '/admin/users',
      label: 'Users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      to: '/admin/activity',
      label: 'System Activity',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      to: '/admin/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={sidebarLinks} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
