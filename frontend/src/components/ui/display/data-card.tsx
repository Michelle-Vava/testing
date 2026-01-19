import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';

/**
 * Color schemes for DataCard
 */
export type DataCardColorScheme = 'primary' | 'success' | 'warning' | 'neutral' | 'info';

const colorSchemes: Record<DataCardColorScheme, {
  cardBg: string;
  textLabel: string;
  textValue: string;
  textSub: string;
  iconBg: string;
}> = {
  primary: {
    cardBg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    textLabel: 'text-yellow-700',
    textValue: 'text-yellow-900',
    textSub: 'text-yellow-600',
    iconBg: 'bg-yellow-500',
  },
  success: {
    cardBg: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    textLabel: 'text-green-700',
    textValue: 'text-green-900',
    textSub: 'text-green-600',
    iconBg: 'bg-green-500',
  },
  warning: {
    cardBg: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    textLabel: 'text-amber-700',
    textValue: 'text-amber-900',
    textSub: 'text-amber-600',
    iconBg: 'bg-amber-500',
  },
  neutral: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
    textLabel: 'text-slate-700',
    textValue: 'text-slate-900',
    textSub: 'text-slate-500',
    iconBg: 'bg-slate-700',
  },
  info: {
    cardBg: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    textLabel: 'text-blue-700',
    textValue: 'text-blue-900',
    textSub: 'text-blue-600',
    iconBg: 'bg-blue-500',
  },
};

/**
 * Props for the DataCard component
 */
export interface DataCardProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Label/title for the statistic */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional descriptive text */
  subtitle?: string;
  /** Color theme */
  colorScheme?: DataCardColorScheme;
  /** Optional link destination */
  href?: string;
  /** Optional badge/label to display */
  badge?: React.ReactNode;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Generic data display card with icon, value, and optional subtitle
 * 
 * @example
 * ```tsx
 * <DataCard
 *   icon={<Car className="w-5 h-5" />}
 *   title="Vehicles"
 *   value={3}
 *   subtitle="registered"
 *   colorScheme="primary"
 *   href="/vehicles"
 * />
 * ```
 */
export function DataCard({
  icon,
  title,
  value,
  subtitle,
  colorScheme = 'neutral',
  href,
  badge,
  onClick,
}: DataCardProps) {
  const colors = colorSchemes[colorScheme];
  
  const content = (
    <Card className={`${colors.cardBg} ${(href || onClick) ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${colors.textLabel}`}>{title}</p>
            <p className={`text-2xl font-bold ${colors.textValue}`}>{value}</p>
            {subtitle && (
              <p className={`text-sm ${colors.textSub}`}>{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`${colors.iconBg} p-3 rounded-full text-white`}>
              {icon}
            </div>
            {badge}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content}</button>;
  }

  return content;
}
