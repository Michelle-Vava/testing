import { useState } from 'react';

interface AdvancedOptionsSectionProps {
  urgency: 'low' | 'medium' | 'high';
  preferredDate: string;
  budgetMin: string;
  budgetMax: string;
  onUrgencyChange: (urgency: 'low' | 'medium' | 'high') => void;
  onPreferredDateChange: (date: string) => void;
  onBudgetMinChange: (min: string) => void;
  onBudgetMaxChange: (max: string) => void;
}

export function AdvancedOptionsSection({
  urgency,
  preferredDate,
  budgetMin,
  budgetMax,
  onUrgencyChange,
  onPreferredDateChange,
  onBudgetMinChange,
  onBudgetMaxChange,
}: AdvancedOptionsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Add details (optional)
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency
            </label>
            <div className="flex gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={urgency === level}
                    onChange={(e) => onUrgencyChange(e.target.value as typeof urgency)}
                    className="mr-2"
                  />
                  <span className="capitalize text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              name="date"
              type="date"
              value={preferredDate}
              onChange={(e) => onPreferredDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              aria-label="Preferred Date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => onBudgetMinChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Min"
                aria-label="Minimum budget"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => onBudgetMaxChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                placeholder="Max"
                aria-label="Maximum budget"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
