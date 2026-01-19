import React from 'react';
import clsx from 'clsx';

interface AlertBoxProps {
  variant?: 'success' | 'info' | 'warning' | 'error' | 'purple' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

// Generic colored alert box for status messages and notifications
export function AlertBox({ 
  variant = 'neutral', 
  children, 
  icon, 
  className 
}: AlertBoxProps) {
  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    neutral: 'bg-slate-50 border-slate-200 text-slate-800',
  };

  return (
    <div className={clsx('border rounded-lg p-4', variants[variant], className)}>
      {icon ? (
        <div className="flex items-center gap-2">
          {icon}
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
