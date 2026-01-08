import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  job?: {
    request: {
      title: string;
      vehicle: {
        make: string;
        model: string;
        year: number;
      };
    };
  };
}

interface ReviewCardProps {
  review: Review;
  showJobInfo?: boolean;
}

export function ReviewCard({ review, showJobInfo = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            {review.owner.avatarUrl ? (
              <img
                src={review.owner.avatarUrl}
                alt={review.owner.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-600 font-semibold">
                {review.owner.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Name & Rating */}
          <div>
            <p className="font-medium text-gray-900">{review.owner.name}</p>
            <div className="flex items-center gap-2">
              {renderStars(review.rating)}
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Job Info (optional) */}
      {showJobInfo && review.job && (
        <div className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
          <span className="font-medium">Service: </span>
          {review.job.request.title} •{' '}
          {review.job.request.vehicle.year} {review.job.request.vehicle.make}{' '}
          {review.job.request.vehicle.model}
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}

      {/* Provider Response */}
      {review.response && (
        <div className="mt-3 pl-4 border-l-2 border-blue-200 bg-blue-50 rounded-r p-3">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Response from provider
          </p>
          <p className="text-sm text-gray-700">{review.response}</p>
          {review.respondedAt && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(review.respondedAt), { addSuffix: true })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
