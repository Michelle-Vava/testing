import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/sidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Footer } from '@/components/layout/footer';
import { requireOnboarding } from '@/features/auth/utils/guards';
import { LayoutDashboard, Car, FileText, Wrench, Settings, MessageSquare } from 'lucide-react';

export const Route = createFileRoute('/owner/_layout')({
  beforeLoad: () => {
    const user = requireOnboarding();
    if (user.role !== 'owner') {
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
    <div className="flex h-full bg-slate-50">
      <Sidebar links={sidebarLinks} />
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
