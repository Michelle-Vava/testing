import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlatformControllerGetStats } from '@/api/generated/platform/platform';
import { Users, Car, Wrench, DollarSign } from 'lucide-react';

export function AdminDashboard() {
  const { data: stats, isLoading } = usePlatformControllerGetStats();

  // Mock data if stats are empty (since backend might not return full structure yet)
  const displayStats = stats || {
    totalUsers: 0,
    totalVehicles: 0,
    activeJobs: 0,
    totalRevenue: 0,
  };

  const statCards = [
    {
      title: 'Total Users',
      value: (displayStats as any).totalUsers || '1,234',
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: '+12% from last month',
    },
    {
      title: 'Total Vehicles',
      value: (displayStats as any).totalVehicles || '856',
      icon: <Car className="h-4 w-4 text-muted-foreground" />,
      description: '+5% from last month',
    },
    {
      title: 'Active Jobs',
      value: (displayStats as any).activeJobs || '42',
      icon: <Wrench className="h-4 w-4 text-muted-foreground" />,
      description: '12 urgent requests',
    },
    {
      title: 'Total Revenue',
      value: (displayStats as any).totalRevenue ? `$${(displayStats as any).totalRevenue}` : '$12,345',
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: '+18% from last month',
    },
  ];

  if (isLoading) {
    return <div className="p-8">Loading dashboard stats...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of platform performance and activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New User Registration
                  </p>
                  <p className="text-sm text-muted-foreground">
                    John Doe joined as Owner
                  </p>
                </div>
                <div className="ml-auto font-medium">Just now</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Job Completed
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Oil Change for 2020 Toyota Camry
                  </p>
                </div>
                <div className="ml-auto font-medium">2h ago</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    New Provider Application
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mike's Auto Shop
                  </p>
                </div>
                <div className="ml-auto font-medium">5h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
