import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut } from 'lucide-react';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: '/auth/login' });
  };

  return (
    <header className="bg-[#0F172A] border-b border-[#1E293B] h-16 px-8 flex items-center justify-end sticky top-0 z-30 shadow-lg">
      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-3">
        <NotificationBell />
        
        <div className="h-6 w-px bg-[#334155]" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#1E293B] pl-2 pr-4 py-1 h-auto border border-transparent hover:border-[#334155] rounded-full">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-[#334155]">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <span className="text-sm font-medium text-[#CBD5E1] hidden md:block">
                {user?.name || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: '/owner/settings' })}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/owner/settings' })}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
