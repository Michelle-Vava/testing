import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { requireOnboarding } from '@/features/auth/utils/guards';
import { LayoutDashboard, Car, FileText, Wrench, Settings, MessageSquare } from 'lucide-react';

export const Route = createFileRoute('/owner/_layout')({
  beforeLoad: () => {
    const user = requireOnboarding();
    if (!user.roles?.includes('owner')) {
      throw redirect({ to: '/unauthorized' });
    }
  },
  component: OwnerLayout,
});

function OwnerLayout() {
  const sidebarLinks = [
    {
      to: '/owner/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: '/owner/vehicles',
      label: 'My Vehicles',
      icon: <Car className="w-5 h-5" />,
    },
    {
      to: '/owner/requests',
      label: 'Service Requests',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      to: '/owner/providers',
      label: 'Browse Providers',
      icon: <Wrench className="w-5 h-5" />,
    },
    {
      to: '/messages',
      label: 'Messages',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      to: '/owner/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <DashboardShell header={<DashboardHeader />} sidebarLinks={sidebarLinks}>
      <Outlet />
    </DashboardShell>
  );
}
