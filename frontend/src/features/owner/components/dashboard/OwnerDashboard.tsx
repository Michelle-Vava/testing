import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useRequests } from '@/features/requests/hooks/use-requests';
import { StatusSnapshotCard } from '../cards/StatusSnapshotCard';
import { GettingStartedChecklist } from '../checklists/GettingStartedChecklist';
import { ActiveRequestsSection } from '../sections/ActiveRequestsSection';
import { QuickActions } from '../actions/QuickActions';
import { PopularServices } from '../sections/PopularServices';
import { HowItWorksCard } from '../cards/HowItWorksCard';
import { HeroStateBanner } from '../banners/HeroStateBanner';
import { Bell, MessageSquare } from 'lucide-react';
import type { ServiceRequest, Quote } from '@/features/requests/types/request';

/**
 * Owner Dashboard - Adaptive layout based on user journey stage
 * 
 * NEW USER LAYOUT:
 * ┌─────────────────────────────────────────┐
 * │ Hero State Banner                       │
 * ├─────────────────────────────────────────┤
 * │ Getting Started Checklist               │
 * ├──────────────────────┬──────────────────┤
 * │ How It Works         │ Quick Actions    │
 * │ Active Requests      │ Popular Services │
 * └──────────────────────┴──────────────────┘
 * 
 * ESTABLISHED USER LAYOUT:
 * ┌─────────────────────────────────────────┐
 * │ ALERTS (pending quotes)                 │
 *    │  🔔 3 New Quotes Waiting!               │
 *    ├─────────────────────────────────────────┤
 *    │ Hero State Banner                       │
 *    ├─────────────────────────────────────────┤
 *    │ Status Snapshot Card                    │
 *    │  Vehicles: 2 | Requests: 5 | Active: 3  │
 *    ├──────────────────────┬──────────────────┤
 *    │ Active Requests      │ Quick Actions    │
 *    │  📋 Oil Change       │  + Add Vehicle   │
 *    │     Status: Quoted   │  + New Request   │
 *    │     3 quotes         │                  │
 *    │                      │ Popular Services │
 *    │  📋 Brake Repair     │  - Tire Rotation │
 *    │     Status: Open     │  - Inspection    │
 *    └──────────────────────┴──────────────────┘
 * 
 * CONDITIONAL RENDERING LOGIC:
 * - Alerts: Show if `totalPendingQuotes > 0`
 * - Status Snapshot: Show if `isEstablishedUser = true`
 * - Getting Started: Show if `isEstablishedUser = false`
 * - How It Works: Show if `isEstablishedUser = false`
 * - Active Requests: Always show (empty state for new users)
 * 
 * DATA DEPENDENCIES:
 * - useVehicles() - Fetches user's vehicles (React Query)
 * - useRequests() - Fetches service requests (React Query)
 * - useAuth() - Current user info
 */
export function OwnerDashboard() {
  const { user } = useAuth();
  const { vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
  const { requests = [], isLoading: isLoadingRequests } = useRequests();

  const isLoading = isLoadingVehicles || isLoadingRequests;
  const hasVehicles = vehicles.length > 0;
  const hasRequests = requests.length > 0;
  
  // "Established" user definition: Has at least one vehicle or request
  const isEstablishedUser = hasVehicles || hasRequests;

  // Memoize expensive calculations to prevent unnecessary recalculations
  const { requestsWithQuotes, totalPendingQuotes } = useMemo(() => {
    const withQuotes = requests.filter((r: ServiceRequest) => 
      r.status === 'quoted' && r.quotes && r.quotes.some((q: Quote) => q.status === 'pending')
    );
    const pendingCount = withQuotes.reduce((sum: number, r: ServiceRequest) => 
      sum + (r.quotes?.filter((q: Quote) => q.status === 'pending').length || 0), 0
    );
    return { requestsWithQuotes: withQuotes, totalPendingQuotes: pendingCount };
  }, [requests]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* 1. URGENT ALERTS (Top priority) */}
      {totalPendingQuotes > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {totalPendingQuotes} New Quote{totalPendingQuotes > 1 ? 's' : ''} Waiting!
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Action Required: Review quotes for your pending requests.
              </p>
              <div className="flex flex-wrap gap-2">
                {requestsWithQuotes.slice(0, 3).map((req: ServiceRequest) => (
                  <Link key={req.id} to="/owner/requests/$requestId" params={{ requestId: req.id }}>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Review Quotes for {req.vehicle?.model || 'Request'}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1.5. HERO STATE BANNER */}
      <HeroStateBanner />

      {/* 2. STATUS SNAPSHOT (Replaces Getting Started for established users) */}
      <section>
        {isEstablishedUser && user ? (
          <StatusSnapshotCard user={user} vehicles={vehicles} requests={requests} />
        ) : (
          <GettingStartedChecklist />
        )}
      </section>

      {/* 3. PRIMARY FOCUS ZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Active Work */}
        <div className="lg:col-span-2 space-y-6">
           {/* If user is new, explain how it works first */}
           {!isEstablishedUser && <HowItWorksCard />}

           <ActiveRequestsSection requests={requests} isLoading={isLoading} />
        </div>

        {/* Sidebar Column: Actions & Discovery */}
        <div className="space-y-6">
           <QuickActions hasVehicles={hasVehicles} />
           
           <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Explore</h3>
              <PopularServices />
           </div>
        </div>
      </div>
    </div>
  );
}
