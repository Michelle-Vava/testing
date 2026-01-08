import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Car, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

export function HowItWorksCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <span className="bg-slate-100 p-1 rounded text-slate-600">ℹ️</span>
          How Shanda Works
        </h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      
      {isOpen && (
        <CardContent className="pt-0 pb-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <Car className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">1. Add Vehicle</p>
              <p className="text-xs text-slate-500 mt-1">Register your car to request service</p>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">2. Request Service</p>
              <p className="text-xs text-slate-500 mt-1">Describe what you need done</p>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">3. Compare Quotes</p>
              <p className="text-xs text-slate-500 mt-1">Review offers from local pros</p>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">4. Book & Relax</p>
              <p className="text-xs text-slate-500 mt-1">Secure booking with confidence</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
