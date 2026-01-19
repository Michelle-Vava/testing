import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Provider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  responseTime: string;
  specialties?: string[];
  email: string;
  isVerified: boolean;
  
  // Extra fields for the modal details
  bio?: string;
  businessName?: string;
  yearsInBusiness?: number;
  shopAddress?: string;
  shopCity?: string;
  shopType?: string; // e.g. 'Mobile Service' or 'Shop'
  certifications?: string[];
}

interface ProviderProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider;
}

export function ProviderProfileDrawer({ isOpen, onClose, provider }: ProviderProfileDrawerProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRequestQuote = () => {
    onClose();
    if (isAuthenticated) {
      navigate({ 
        to: '/owner/requests/new',
        search: { providerId: provider.id } 
      });
    } else {
      navigate({ to: '/auth/signup', search: { mode: 'owner' } });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-700">
              {provider.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-900">
                {provider.businessName || provider.name}
              </DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-1">
                {provider.shopType || (provider.shopAddress ? 'Auto Shop' : 'Mobile Mechanic')} 
                {provider.shopCity ? ` • ${provider.shopCity}` : ''}
              </DialogDescription>
              
              <div className="flex items-center gap-3 mt-2">
                 <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded text-sm text-yellow-800 font-medium">
                   <span>★</span> {Number(provider.rating).toFixed(1)} ({provider.reviewCount} reviews)
                 </div>
                 {provider.isVerified && (
                   <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                     ✓ Verified
                   </span>
                 )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 space-y-6">
          {provider.bio && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">About</h4>
              <p className="text-slate-600 leading-relaxed">{provider.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {provider.specialties?.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-slate-100 text-slate-700">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {provider.certifications && provider.certifications.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Certifications</h4>
                <div className="space-y-1">
                   {provider.certifications.map(cert => (
                     <div key={cert} className="flex items-center gap-2 text-sm text-slate-600">
                       <span className="text-green-500">✓</span> {cert}
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div>
              <div className="text-sm font-medium text-slate-500 mb-1">Response Time</div>
              <div className="text-slate-900 font-semibold">{provider.responseTime || 'Within 1 hour'}</div>
            </div>
            <div>
               <div className="text-sm font-medium text-slate-500 mb-1">Experience</div>
               <div className="text-slate-900 font-semibold">{provider.yearsInBusiness || '5+'} Years</div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t border-slate-100 sm:justify-between items-center">
          <div className="text-sm text-slate-500">
            Based in {provider.shopAddress || provider.shopCity || 'Halifax, NS'}
          </div>
          <Button size="lg" className="px-8" onClick={handleRequestQuote}>
            Request Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
