import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Car, FileText, CheckCircle, ShieldCheck } from 'lucide-react';

/**
 * Collapsible card explaining how Service Connect works
 * 
 * Shows a 4-step process:
 * 1. Add Vehicle
 * 2. Request Service
 * 3. Compare Quotes
 * 4. Get Service Done
 */
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
          How Service Connect Works
        </h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      
      {isOpen && (
        <CardContent className="pt-0 pb-6 px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">1. Post a request</p>
              <p className="text-xs text-slate-500 mt-1">Tell us what's wrong in a few seconds</p>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <CheckCircle className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">2. Get quotes</p>
              <p className="text-xs text-slate-500 mt-1">Providers send estimates based on your request</p>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">3. Choose confidently</p>
              <p className="text-xs text-slate-500 mt-1">Compare pricing + timelines</p>
            </div>

            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 text-slate-700">
                <Car className="w-5 h-5" />
              </div>
              <p className="font-medium text-slate-900 text-sm">4. Chat & confirm</p>
              <p className="text-xs text-slate-500 mt-1">Coordinate details and mark job complete</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
