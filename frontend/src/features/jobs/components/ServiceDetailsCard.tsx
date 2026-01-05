import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ServiceDetailsCardProps {
  description: string;
  quoteDescription?: string;
  quoteAmount: number;
  estimatedDuration: string;
  includesWarranty: boolean;
}

export function ServiceDetailsCard({
  description,
  quoteDescription,
  quoteAmount,
  estimatedDuration,
  includesWarranty,
}: ServiceDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{description}</p>
          </div>

          {quoteDescription && (
            <div className="pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-2">Provider's Quote</h3>
              <p className="text-gray-700">{quoteDescription}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500 mb-1">Quoted Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(quoteAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Duration</p>
              <p className="font-medium">{estimatedDuration}</p>
            </div>
          </div>

          {includesWarranty && (
            <div className="flex items-center gap-2 text-green-600 pt-4 border-t">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Includes Warranty</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
