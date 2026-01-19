import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Props for the StatsCard component
 */
interface StatsCardProps {
  /** Label text shown above the value */
  title: string;
  /** Main statistic value to display */
  value: string | number;
  /** Optional descriptive text below the value */
  subtext?: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Color theme for the card */
  colorScheme: 'yellow' | 'slate' | 'amber' | 'navy';
}

const colorSchemes = {
  yellow: {
    cardBg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    textLabel: 'text-yellow-700',
    textValue: 'text-yellow-900',
    textSub: 'text-yellow-600',
    iconBg: 'bg-yellow-500',
  },
  slate: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
    textLabel: 'text-slate-700',
    textValue: 'text-slate-900',
    textSub: 'text-slate-500',
    iconBg: 'bg-slate-700',
  },
  amber: {
    cardBg: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    textLabel: 'text-amber-700',
    textValue: 'text-amber-900',
    textSub: 'text-amber-600',
    iconBg: 'bg-amber-500',
  },
  navy: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
    textLabel: 'text-slate-700',
    textValue: 'text-slate-900',
    textSub: 'text-slate-500',
    iconBg: 'bg-slate-800',
  },
};

/**
 * Card component for displaying statistics with icon and color theming
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Active Requests"
 *   value={5}
 *   subtext="2 pending quotes"
 *   icon={<FileText className="h-6 w-6 text-white" />}
 *   colorScheme="yellow"
 * />
 * ```
 */
export function StatsCard({ title, value, subtext, icon, colorScheme }: StatsCardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <Card className={colors.cardBg}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${colors.textLabel}`}>{title}</p>
            <p className={`text-2xl font-bold ${colors.textValue}`}>{value}</p>
            {subtext && (
              <p className={`text-xs mt-1 ${colors.textSub}`}>{subtext}</p>
            )}
          </div>
          <div className={`w-12 h-12 ${colors.iconBg} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
