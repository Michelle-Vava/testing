import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Car, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { User as UserType } from '@/types/auth';
import type { Vehicle } from '@/features/vehicles/types/vehicle';
import type { ServiceRequest } from '@/types/api';

/**
 * Props for the StatusSnapshotCard component
 */
interface StatusSnapshotCardProps {
  /** Current user data */
  user: UserType | null;
  /** User's vehicles */
  vehicles: Vehicle[];
  /** User's service requests */
  requests: ServiceRequest[];
}

/**
 * Dashboard card showing quick status overview
 * 
 * Displays:
 * - Profile completion percentage
 * - Number of registered vehicles
 * - Active service requests count
 */
export function StatusSnapshotCard({ user, vehicles, requests }: StatusSnapshotCardProps) {
  // Include open, quoted, and in_progress as "active" 
  const activeRequestsCount = requests.filter(r => 
    ['open', 'quoted', 'in_progress'].includes(r.status.toLowerCase())
  ).length;
  
  // Calculate profile completion (mock logic based on available fields)
  const calculateProfileCompletion = () => {
    let score = 0;
    if (user.firstName) score += 20;
    if (user.lastName) score += 20;
    if (user.email) score += 20;
    if (user.phone) score += 20;
    if (user.address) score += 20; // Assuming address exists
    return score;
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <Card className="shadow-sm border border-slate-200 bg-white mb-8">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Profile Column */}
          <Link to="/owner/settings" className="group p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Profile Status</span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-bold text-slate-900">{profileCompletion}%</div>
                    <div className="text-xs text-slate-500">Completion</div>
                </div>
                {profileCompletion < 100 && (
                    <span className="text-xs font-medium text-blue-600">Complete now &rarr;</span>
                )}
            </div>
          </Link>

          {/* Vehicles Column */}
          <Link to="/owner/vehicles" className="group p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full group-hover:scale-110 transition-transform">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">My Garage</span>
            </div>
             <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-bold text-slate-900">{vehicles.length}</div>
                    <div className="text-xs text-slate-500">{vehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Active</div>
                </div>
                <span className="text-xs font-medium text-emerald-600">Manage &rarr;</span>
            </div>
          </Link>

          {/* Requests Column */}
          <Link to="/owner/requests" className="group p-5 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-full group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Active Requests</span>
            </div>
             <div className="flex items-end justify-between">
                <div>
                    <div className="text-2xl font-bold text-slate-900">{activeRequestsCount}</div>
                    <div className="text-xs text-slate-500">In Progress</div>
                </div>
                {activeRequestsCount > 0 && (
                    <span className="text-xs font-medium text-yellow-600">View Status &rarr;</span>
                )}
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
