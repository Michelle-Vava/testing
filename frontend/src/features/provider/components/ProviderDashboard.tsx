import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRequestsControllerFindAll } from '@/api/generated/requests/requests';
import { usePaymentsControllerListTransactions } from '@/api/generated/payments/payments';
import { useJobsControllerFindAll } from '@/api/generated/jobs/jobs';
import { JobCard } from '@/routes/provider/_layout/-components/job-card';
import { formatCurrency } from '@/utils/formatters';
import { 
  DollarSign, 
  Star, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function ProviderDashboard() {
  const { user } = useAuth();
  
  // Real Data Fetching
  const { data: requestRes } = useRequestsControllerFindAll();
  const availableJobs = (requestRes as any)?.data || [];
  
  const { data: transactions = [] } = usePaymentsControllerListTransactions();
  
  const { data: jobRes } = useJobsControllerFindAll();
  const allJobs = (jobRes as any)?.data || [];

  // Derived Calculations
  const urgentJobs = availableJobs.filter((j: any) => j.urgency === 'URGENT');
  const activeJobs = allJobs.filter((j: any) => j.status === 'in_progress');
  const totalEarnings = transactions.reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  
  // User Stats
  const rating = user?.rating || 5.0;
  const reviewCount = user?.reviewCount || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium">Online & Accepting Jobs</span>
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Earnings (Total)</p>
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalEarnings)}</h3>
              <span className="text-xs text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> Real-time
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Available Jobs Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Available Jobs</p>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{availableJobs.length}</h3>
              <span className="text-xs text-gray-500">
                {urgentJobs.length > 0 ? `${urgentJobs.length} urgent` : 'Updated just now'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Jobs Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{activeJobs.length}</h3>
              <span className="text-xs text-gray-500">In progress</span>
            </div>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gray-900">{rating}</h3>
              <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Jobs Alert */}
          {urgentJobs.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">High Priority Requests</p>
                    <p className="text-sm text-red-700">
                      {urgentJobs.length} customers need help immediately. Quote now to win these jobs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">New Service Requests</h2>
            <Link to="/provider/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View All Jobs &rarr;
            </Link>
          </div>

          {availableJobs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No new requests</h3>
                <p className="text-gray-500 max-w-sm mt-1">
                  We'll notify you when new vehicle owners in your area post service requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableJobs.slice(0, 5).map((job: any) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full w-[85%]"></div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Business Details Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Background Check Cleared</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    <span>Add Shop Photos</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                   <Link to="/provider/profile">Manage Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
             <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/provider/jobs">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => alert('Map view coming soon!')}>
                 <MapPin className="w-4 h-4 mr-2" />
                 Map View
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                 <Link to="/provider/payments">
                   <DollarSign className="w-4 h-4 mr-2" />
                   Payout Settings
                 </Link>
              </Button>
            </CardContent>
          </Card>

           {/* Support */}
           <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Our provider success team is here to help you win more jobs.
              </p>
              <Button size="sm" variant="secondary" className="w-full bg-white text-blue-700 hover:bg-blue-50 border border-blue-200">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

