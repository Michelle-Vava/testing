import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { UserRoles } from '@/lib/constants';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { ProviderHeader } from '@/components/layout/ProviderHeader';
import { LayoutDashboard, Car, FileText, Wrench, Settings, MessageSquare } from 'lucide-react';

export const Route = createFileRoute('/messages')({
  component: MessagesLayout,
});

function MessagesLayout() {
  const { user } = useAuth();
  
  const isProviderMode = user?.role === UserRoles.PROVIDER;

  const ownerSidebarLinks = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/owner/vehicles', label: 'My Vehicles', icon: <Car className="w-5 h-5" /> },
    { to: '/owner/requests', label: 'Service Requests', icon: <FileText className="w-5 h-5" /> },
    { to: '/owner/providers', label: 'Browse Providers', icon: <Wrench className="w-5 h-5" /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/owner/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const providerSidebarLinks = [
    { to: '/provider/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/provider/jobs', label: 'Available Jobs', icon: <Wrench className="w-5 h-5" /> },
    { to: '/messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const sidebarLinks = isProviderMode ? providerSidebarLinks : ownerSidebarLinks;
  const header = isProviderMode ? <ProviderHeader /> : <DashboardHeader />;

  return (
    <DashboardShell header={header} sidebarLinks={sidebarLinks}>
      <Outlet />
    </DashboardShell>
  );
}
