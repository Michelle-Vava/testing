import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { QuoteSubmissionDrawer } from './QuoteSubmissionDrawer';
import { useState } from 'react';

interface Request {
  id: string;
  title: string;
  description: string;
  vehicle: string;
  urgency: string;
  posted: string;
  quoteCount: number;
}

interface RecentRequestsSectionProps {
  requests: Request[];
  loading?: boolean;
  error?: Error | null;
  getUrgencyColor: (urgency: string) => string;
}

export function RecentRequestsSection({ requests, loading, error, getUrgencyColor }: RecentRequestsSectionProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSubmitQuote = (request: Request) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Recent Service Requests</h2>
              <p className="text-slate-600 mt-2">Live and pilot service requests on Shanda</p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading requests...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load service requests. Please try again later.</p>
              <p className="text-sm text-gray-500 mt-2">{(error as any)?.message}</p>
            </div>
          )}

          {!loading && !error && requests.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Be the First to Post</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Join our pilot cohort and get competing quotes from verified providers. Limited spots available.
              </p>
              <Link to="/auth/signup">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
                  Request a Quote
                </Button>
              </Link>
            </div>
          )}

          {!loading && !error && requests.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map((request, idx) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, ease: 'easeOut', delay: idx * 0.1 }}
                >
                  <Card hoverable>
                    <CardContent className="py-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
                          <div className="text-sm text-gray-600 mb-2">{request.vehicle}</div>
                        </div>
                        <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          {request.posted} • {request.quoteCount} quotes
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSubmitQuote(request)}
                        >
                          Submit Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quote Submission Drawer */}
      {selectedRequest && (
        <QuoteSubmissionDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          request={selectedRequest}
        />
      )}
    </>
  );
}
