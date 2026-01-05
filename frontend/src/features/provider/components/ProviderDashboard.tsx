import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRequestsControllerFindAll } from '@/api/generated/requests/requests';
import { JobCard } from '@/routes/provider/_layout/-components/job-card';

export function ProviderDashboard() {
  const { user } = useAuth();
  const { data: availableJobs = [] } = useRequestsControllerFindAll();
  const urgentJobs = availableJobs.filter((j: any) => j.urgency === 'URGENT');

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Find new service opportunities
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableJobs.length}</p>
                <p className="text-sm text-gray-600">Available Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{urgentJobs.length}</p>
                <p className="text-sm text-gray-600">Urgent Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Jobs Alert */}
      {urgentJobs.length > 0 && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-900">Urgent Service Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-800">
                  {urgentJobs.length} urgent {urgentJobs.length === 1 ? 'request needs' : 'requests need'} immediate attention
                </p>
              </div>
              <Button onClick={() => alert('Jobs page coming soon!')}>View Urgent Jobs</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Available Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Browse Service Requests</h2>
            <p className="text-sm text-gray-600 mt-1">Review requests and submit competitive quotes to win jobs</p>
          </div>
        </div>

        {availableJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests available right now</h3>
              <p className="text-gray-600">New service requests from vehicle owners will appear here when posted</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {availableJobs.slice(0, 5).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
            {availableJobs.length > 5 && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => alert('Jobs page coming soon!')}>
                  View All {availableJobs.length} Requests
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

