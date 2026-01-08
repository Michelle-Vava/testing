import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useRequests } from '@/features/requests/hooks/use-requests';
import { StatsCard } from '@/routes/owner/_layout/-components/stats-card';
import { HeroStateBanner } from './HeroStateBanner';
import { GettingStartedChecklist } from './GettingStartedChecklist';
import { HowItWorksCard } from './HowItWorksCard';
import { ActivityFeed } from './ActivityFeed';
import { PopularServices } from './PopularServices';
import { ProviderPreview } from './ProviderPreview';
import { Bell, MessageSquare, CheckCircle } from 'lucide-react';

export function OwnerDashboard() {
  const { user: _user } = useAuth();
  const { vehicles = [] } = useVehicles();
  const { requests = [] } = useRequests();
  const activeRequests = requests.filter((r: any) => r.status === 'OPEN' || r.status === 'QUOTED');
  
  // Calculate requests with pending quotes
  const requestsWithQuotes = requests.filter((r: any) => 
    r.status === 'QUOTED' && r.quotes && r.quotes.some((q: any) => q.status === 'pending')
  );
  const totalPendingQuotes = requestsWithQuotes.reduce((sum: number, r: any) => 
    sum + (r.quotes?.filter((q: any) => q.status === 'pending').length || 0), 0
  );

  const hasVehicles = vehicles.length > 0;

  return (
    <div className="max-w-7xl space-y-6">
      {/* Pending Quotes Alert */}
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
                Providers have responded to your service request{requestsWithQuotes.length > 1 ? 's' : ''}. Review and accept the best quote to get started.
              </p>
              <div className="flex flex-wrap gap-2">
                {requestsWithQuotes.slice(0, 3).map((req: any) => (
                  <Link key={req.id} to="/owner/requests/$requestId" params={{ requestId: req.id }}>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {req.title} ({req.quotes?.filter((q: any) => q.status === 'pending').length})
                    </Button>
                  </Link>
                ))}
                {requestsWithQuotes.length > 3 && (
                  <Link to="/owner/requests">
                    <Button size="sm" variant="outline">
                      View All Requests
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ZONE 1: Orientation - What should I do right now? */}
      <section>
        {/* Stats Bar - Only show if user has vehicles (Returning Owner) */}
        {hasVehicles && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <StatsCard
              title="Total Requests"
              value={requests.length === 0 ? '—' : requests.length}
              subtext={requests.length === 0 ? 'Create your first request' : undefined}
              colorScheme="slate"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />

            <StatsCard
              title="Active Requests"
              value={activeRequests.length === 0 ? '—' : activeRequests.length}
              subtext={activeRequests.length === 0 ? 'No active jobs right now' : undefined}
              colorScheme="yellow"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <StatsCard
              title="Vehicles"
              value={vehicles.length}
              colorScheme="navy"
              icon={
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              }
            />
          </div>
        )}

        {/* Hero State Banner - Primary Focus */}
        <HeroStateBanner />
      </section>

      {/* ZONE 2: Progress & Enablement - How do I succeed? */}
      <section className="space-y-3">
        <GettingStartedChecklist />
        <HowItWorksCard />
      </section>

      {/* ZONE 3: Action & Exploration - What can I do next? */}
      <section className="bg-slate-50 -mx-6 px-6 py-6 space-y-4">
        <PopularServices />
        
        <Card className="shadow-md border border-slate-200 bg-white">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {hasVehicles ? (
                <Link
                  to="/owner/requests/new"
                  search={{ serviceType: undefined, providerId: undefined }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors"
                >
                  <div className="p-2 bg-yellow-500 rounded-lg">
                    <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Create Request</p>
                    <p className="text-sm text-slate-600">Get quotes from mechanics</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 opacity-75 cursor-not-allowed">
                  <div className="p-2 bg-slate-300 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-500">Create Request</p>
                    <p className="text-sm text-slate-500">Add a vehicle to request quotes</p>
                  </div>
                </div>
              )}

              <Link
                to="/owner/vehicles"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="p-2 bg-slate-700 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Manage Vehicles</p>
                  <p className="text-sm text-slate-600">Add or edit vehicles</p>
                </div>
              </Link>

              <Link
                to="/owner/settings"
                className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="p-2 bg-slate-700 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Settings</p>
                  <p className="text-sm text-slate-600">Update your profile</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ZONE 4: History & Trust - Is this alive and trustworthy? */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ActivityFeed />
          <ProviderPreview />
        </div>
      </section>
    </div>
  );
}

