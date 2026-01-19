import React from 'react';

interface CardSkeletonProps {
  lines?: number;
}

interface ListSkeletonProps {
  items?: number;
}

// Generic card skeleton loader with customizable line count
export function CardSkeleton({ lines = 3 }: CardSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

// Generic list skeleton loader with avatar + text pattern
export function ListSkeleton({ items = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Generic grid skeleton for card grids
export function GridSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="h-48 bg-slate-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}
