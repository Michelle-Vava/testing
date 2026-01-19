import React from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Props for the ListSection component
 */
export interface ListSectionProps<T> {
  /** Section title */
  title: string;
  /** Link destination for "View All" */
  viewAllHref?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Items to render */
  items: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Key extractor function */
  keyExtractor: (item: T, index: number) => string;
  /** Empty state configuration */
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
  };
  /** Maximum items to show (default: no limit) */
  maxItems?: number;
  /** Custom loading message */
  loadingMessage?: string;
  /** Additional CSS class for the list container */
  className?: string;
}

/**
 * Generic list section with title, optional "View All" link, and loading/empty states
 * 
 * @example
 * ```tsx
 * <ListSection
 *   title="Active Requests"
 *   viewAllHref="/requests"
 *   isLoading={isLoading}
 *   items={requests}
 *   renderItem={(request) => <RequestCard request={request} />}
 *   keyExtractor={(request) => request.id}
 *   emptyState={{
 *     icon: <FileText className="w-12 h-12" />,
 *     title: "No active requests",
 *     description: "Create your first service request",
 *     actionLabel: "New Request",
 *     actionHref: "/requests/new"
 *   }}
 *   maxItems={3}
 * />
 * ```
 */
export function ListSection<T>({
  title,
  viewAllHref,
  isLoading = false,
  items,
  renderItem,
  keyExtractor,
  emptyState,
  maxItems,
  loadingMessage = 'Loading...',
  className = '',
}: ListSectionProps<T>) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;
  const hasMore = maxItems && items.length > maxItems;

  if (isLoading) {
    return (
      <section className={className}>
        <SectionHeader title={title} viewAllHref={viewAllHref} />
        <LoadingState message={loadingMessage} />
      </section>
    );
  }

  if (items.length === 0 && emptyState) {
    return (
      <section className={className}>
        <SectionHeader title={title} viewAllHref={viewAllHref} />
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          actionLabel={emptyState.actionLabel}
          actionHref={emptyState.actionHref}
          onAction={emptyState.onAction}
        />
      </section>
    );
  }

  return (
    <section className={className}>
      <SectionHeader 
        title={title} 
        viewAllHref={viewAllHref}
        itemCount={hasMore ? items.length : undefined}
      />
      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <React.Fragment key={keyExtractor(item, index)}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>
      {hasMore && viewAllHref && (
        <div className="mt-4 text-center">
          <Link 
            to={viewAllHref}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all {items.length} items →
          </Link>
        </div>
      )}
    </section>
  );
}

/**
 * Section header with title and optional "View All" link
 */
function SectionHeader({ 
  title, 
  viewAllHref,
  itemCount,
}: { 
  title: string; 
  viewAllHref?: string;
  itemCount?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-slate-900">
        {title}
        {itemCount !== undefined && (
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({itemCount})
          </span>
        )}
      </h2>
      {viewAllHref && (
        <Link 
          to={viewAllHref}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
