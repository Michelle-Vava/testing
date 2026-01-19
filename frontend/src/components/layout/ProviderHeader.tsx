import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { UserRole } from '@/types/enums';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { RoleSwitcher } from '@/components/role-switcher';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, Home } from 'lucide-react';

export function ProviderHeader() {
  const { user, logout, selectRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirect to provider login page so they can easily log back in
    navigate({ to: '/auth/login', search: { mode: 'provider' } });
  };

  const handleOwnerClick = () => {
    selectRole(UserRole.OWNER);
    navigate({ to: '/owner/dashboard' });
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-end sticky top-0 z-30 shadow-sm">
      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-3">
        <RoleSwitcher />
        <NotificationBell />
        
        <div className="h-6 w-px bg-slate-200" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100 pl-2 pr-4 py-1 h-auto border border-transparent hover:border-slate-200 rounded-full relative">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                Provider
              </Badge>
              <span className="text-sm font-medium text-slate-700 hidden md:block">
                {user?.name || 'Provider'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Provider Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: '/provider/profile' })}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: '/provider/payments' })}>
              <Settings className="mr-2 h-4 w-4" />
              Payout Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            {/* Owner Mode Toggle */}
            <DropdownMenuItem onClick={handleOwnerClick}>
              <Home className="mr-2 h-4 w-4" />
              <div className="flex items-center justify-between w-full">
                <span>Switch to Owner</span>
              </div>
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
