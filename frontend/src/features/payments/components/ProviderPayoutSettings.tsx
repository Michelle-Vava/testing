import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { usePaymentsControllerListTransactions } from '@/api/generated/payments/payments';
import { formatCurrency, formatShortDate } from '@/utils/formatters';
import { DollarSign, CreditCard, Building, Download, ExternalLink, AlertCircle } from 'lucide-react';

export function ProviderPayoutSettings() {
  const { user } = useAuth();
  const { data: transactions = [] } = usePaymentsControllerListTransactions();
  
  // Calculate stats
  const totalEarnings = transactions.reduce((acc: number, t: any) => acc + Number(t.amount), 0);
  const pendingPayout = transactions
    .filter((t: any) => t.status === 'completed' && !t.payoutId) // Mock logic for 'not paid out yet'
    .reduce((acc: number, t: any) => acc + Number(t.amount), 0);

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectStripe = () => {
    setIsConnecting(true);
    // Mock delay for "Redirecting to Stripe"
    setTimeout(() => {
      setIsConnecting(false);
      alert('This would redirect to Stripe Connect onboarding in production.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Payments & Payouts</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export History
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <Card className="bg-slate-900 text-white border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Available Balance</CardTitle>
            <CardDescription className="text-slate-400">Funds available for payout</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-baseline gap-2 mb-6">
               <span className="text-4xl font-bold">{formatCurrency(pendingPayout)}</span>
               <span className="text-sm text-slate-400">USD</span>
             </div>
             <Button 
               className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
               disabled={pendingPayout === 0}
               onClick={() => alert('Payout logic coming soon')}
             >
               Initiate Payout
             </Button>
             <p className="text-xs text-slate-500 mt-4 text-center">
               Payouts usually arrive within 2 business days.
             </p>
          </CardContent>
        </Card>

        {/* Payout Method Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Method</CardTitle>
            <CardDescription>Where we send your earnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                   <Building className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900">No bank account connected</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-xs">
                  Connect your bank account via Stripe to receive payouts automatically.
                </p>
                <Button onClick={handleConnectStripe} disabled={isConnecting}>
                  {isConnecting ? 'Connecting...' : 'Connect with Stripe'}
                  {!isConnecting && <ExternalLink className="w-4 h-4 ml-2" />}
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No transactions yet. Complete jobs to start earning!
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                       <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.job?.title || 'Service Payment'}</p>
                      <p className="text-sm text-gray-500">{formatShortDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">+{formatCurrency(Number(t.amount))}</p>
                    <Badge variant="outline" className="text-xs uppercase">
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
