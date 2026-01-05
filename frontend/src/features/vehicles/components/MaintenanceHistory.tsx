import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatShortDate, formatCurrency, formatMileage } from '@/utils/formatters';

interface MaintenanceRecord {
  id: string;
  serviceDate?: string;
  date?: string;
  serviceType: string;
  notes?: string;
  description?: string;
  performedBy?: string;
  providerName?: string;
  cost?: number;
  mileage?: number;
}

interface MaintenanceHistoryProps {
  records: MaintenanceRecord[];
  isLoading: boolean;
  onAddRecord: () => void;
}

/**
 * Displays vehicle maintenance history
 */
export function MaintenanceHistory({ records, isLoading, onAddRecord }: MaintenanceHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading history...</p>
        ) : !records || records.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No maintenance records found</p>
            <Button variant="outline" onClick={onAddRecord}>
              Add First Record
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((record) => (
              <div key={record.id} className="flex gap-4 pb-6 border-b last:border-0 last:pb-0">
                <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                  {formatShortDate(record.serviceDate || record.date || new Date().toISOString())}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900">{record.serviceType}</h4>
                    {record.cost && (
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(record.cost)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{record.notes || record.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    {(record.performedBy || record.providerName) && (
                      <span>Provider: {record.performedBy || record.providerName}</span>
                    )}
                    {record.mileage && (
                      <span>Mileage: {formatMileage(record.mileage)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
