import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={clsx(
        'bg-gray-200',
        variants[variant],
        animations[animation],
        className
      )}
      style={style}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx('bg-white rounded-lg border border-gray-200 shadow-sm p-6', className)}>
      <div className="space-y-4">
        <Skeleton height={24} width="60%" />
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="90%" />
        <div className="flex gap-2 mt-4">
          <Skeleton height={32} width={80} />
          <Skeleton height={32} width={80} />
        </div>
      </div>
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
          className="mb-2"
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className,
}) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const SkeletonProviderCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-4 mb-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
      <Skeleton height={16} className="mb-2" />
      <Skeleton height={16} width="80%" className="mb-4" />
      <div className="flex gap-2 mb-4">
        <Skeleton height={24} width={80} />
        <Skeleton height={24} width={80} />
      </div>
      <Skeleton height={40} />
    </div>
  );
};

export const SkeletonDashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
          <Skeleton height={14} width="60%" className="mb-3" />
          <Skeleton height={32} width="80%" className="mb-2" />
          <Skeleton height={12} width="40%" />
        </div>
      ))}
    </div>
  );
};
