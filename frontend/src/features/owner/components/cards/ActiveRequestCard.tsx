import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActiveRequestCardProps {
  request: any;
}

export function ActiveRequestCard({ request }: ActiveRequestCardProps) {
  const quoteCount = request.quotes?.length || 0;
  const pendingQuotes = request.quotes?.filter((q: any) => q.status === 'pending') || [];
  
  return (
    <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-slate-900">{request.title}</h3>
            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
              {request.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mb-2">
            {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Created {new Date(request.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {quoteCount} {quoteCount === 1 ? 'Quote' : 'Quotes'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pendingQuotes.length > 0 && (
            <div className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
              {pendingQuotes.length} new
            </div>
          )}
          <Link to="/owner/requests/$requestId" params={{ requestId: request.id }}>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
