import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency } from '@/utils/formatters';
import { CheckCircle, XCircle, Shield } from 'lucide-react';

export interface QuoteCardProps {
  /** Quote data to display */
  quote: any; // TODO: Replace with proper Quote type from generated API
  /** Callback when quote is accepted */
  onAccept: () => void;
  /** Callback when quote is rejected */
  onReject: () => void;
}

/**
 * Displays a single quote with provider information and actions
 * 
 * Features:
 * - Provider details with verification badge
 * - Rating and reviews display
 * - Price and duration
 * - Quote description
 * - Warranty badge
 * - Distance from user
 * - Accept/Reject actions for pending quotes
 * - Status display for accepted/rejected quotes
 * 
 * @example
 * <QuoteCard
 *   quote={quote}
 *   onAccept={() => handleAccept(quote.id)}
 *   onReject={() => handleReject(quote.id)}
 * />
 */
export function QuoteCard({ quote, onAccept, onReject }: QuoteCardProps) {
  return (
    <div
      className={`border-2 rounded-xl p-5 transition-all ${
        quote.status === 'accepted'
          ? 'border-green-500 bg-green-50 shadow-md'
          : quote.status === 'rejected'
          ? 'border-gray-300 bg-gray-50 opacity-60'
          : 'border-gray-200 hover:border-yellow-400 hover:shadow-lg'
      }`}
    >
      {/* Provider Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-lg text-gray-900">
              {quote.provider?.name || 'Provider'}
            </h4>
            {quote.provider?.isVerified && (
              <Badge className="bg-blue-600 text-white text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verified
              </Badge>
            )}
          </div>
          {/* Provider Rating */}
          {quote.provider?.rating && (
            <div className="flex items-center gap-2 text-sm mb-1">
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-semibold">{Number(quote.provider.rating).toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({quote.provider.reviewCount} reviews)</span>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600">
            {quote.provider?.phone || quote.provider?.email}
          </p>
          {quote.createdAt && (
            <p className="text-xs text-gray-500 mt-1">
              Quoted {new Date(quote.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {/* Price Display */}
        <div className="text-right ml-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(Number(quote.amount))}
            </p>
            <p className="text-xs text-gray-600 font-medium">
              {quote.estimatedDuration}
            </p>
          </div>
        </div>
      </div>

      {/* Quote Description */}
      {quote.description && (
        <div className="bg-white rounded-lg p-3 mb-3 border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">What's included:</p>
          <p className="text-sm text-gray-700">{quote.description}</p>
        </div>
      )}

      {/* Quote Badges (Warranty, Distance) */}
      <div className="flex items-center gap-4 text-sm mb-3">
        {quote.includesWarranty && (
          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Warranty included</span>
          </div>
        )}
        {quote.provider?.distance && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{quote.provider.distance} miles away</span>
          </div>
        )}
      </div>

      {/* Quote Actions */}
      {quote.status === 'pending' && (
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={onAccept} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Accept Quote
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}>
            <XCircle className="w-4 h-4 mr-1" />
            Decline
          </Button>
        </div>
      )}

      {/* Accepted/Rejected States */}
      {quote.status === 'accepted' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
          <StatusBadge status="accepted" type="quote" />
        </div>
      )}

      {quote.status === 'rejected' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
          <StatusBadge status="rejected" type="quote" />
        </div>
      )}
    </div>
  );
}
