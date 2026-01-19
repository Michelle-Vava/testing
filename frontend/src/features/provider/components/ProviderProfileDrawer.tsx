import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { authGateStore } from '@/features/auth/stores/auth-gate-store';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '@/lib/routes';
import { UserRoles } from '@/lib/constants';
import { useToast } from '@/components/ui/ToastContext';
import { hasRole } from '@/features/auth/utils/auth-utils';

interface ProviderProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    name: string;
    email: string;
    rating: number;
    reviewCount: number;
    distance?: string;
    estimatedArrival?: string;
    specializations?: string[];
    bio?: string;
    verified?: boolean;
    certifications?: string[];
    shopType?: string;
  };
}

export function ProviderProfileDrawer({ isOpen, onClose, provider }: ProviderProfileDrawerProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleRequestQuote = () => {
    if (!user) {
      // Open auth modal with provider context
      authGateStore.open({
        action: 'request a quote',
        providerId: provider.id,
        providerName: provider.name,
        role: UserRoles.OWNER,
      });
      onClose();
    } else if (hasRole(user, 'owner')) {
      // Navigate to quote request with provider pre-selected
      navigate({
        to: ROUTES.OWNER_REQUESTS_NEW,
        search: { providerId: provider.id, serviceType: undefined },
      });
      onClose();
    } else {
      error('Switch to vehicle owner account to request quotes');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Provider Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 px-6 py-6 space-y-6">
                {/* Provider Header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">{provider.name}</h3>
                      {provider.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">{Number(provider.rating).toFixed(1)}</span>
                        <span className="text-slate-400">({provider.reviewCount} reviews)</span>
                      </div>
                    </div>
                    {provider.distance && (
                      <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {provider.distance}
                        </div>
                        {provider.estimatedArrival && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {provider.estimatedArrival}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specializations */}
                {provider.specializations && provider.specializations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Services Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.specializations.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {provider.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">About</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{provider.bio}</p>
                  </div>
                )}

                {/* Shop Type & Certifications */}
                <div className="grid grid-cols-2 gap-4">
                  {provider.shopType && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-1">Shop Type</h4>
                      <p className="text-sm text-slate-600">{provider.shopType}</p>
                    </div>
                  )}
                  {provider.certifications && provider.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-1">Certifications</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {provider.certifications.map((cert, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-2">What does "Verified" mean?</p>
                      <ul className="text-sm text-blue-800 space-y-1.5">
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Background check completed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Proof of insurance verified</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Professional certifications validated</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Maintains minimum 4.0 star rating</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 text-sm text-green-800">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Verified & Insured</p>
                      <p className="text-xs text-green-700 mt-0.5">Background checked and fully licensed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
                <Button onClick={handleRequestQuote} fullWidth size="lg">
                  Request Quote from {provider.name}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
