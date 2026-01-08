import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: {
    to: string;
    label: string;
  };
  actions?: ReactNode;
  breadcrumbs?: Array<{
    label: string;
    to?: string;
  }>;
}

/**
 * Shared page header with title, breadcrumbs, and actions
 */
export function PageHeader({ title, subtitle, backLink, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Back Link */}
      {backLink && (
        <Link
          to={backLink.to}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {backLink.label}
        </Link>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-gray-900">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Title and Actions */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex-shrink-0 ml-4">{actions}</div>}
      </div>
    </div>
  );
}
