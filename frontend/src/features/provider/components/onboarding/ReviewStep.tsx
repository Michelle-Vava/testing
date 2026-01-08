import { CANADIAN_PROVINCES } from '../../utils/validation';
import type { ProviderProfile } from './types';

interface ReviewStepProps {
  profile: ProviderProfile;
}

export function ReviewStep({ profile }: ReviewStepProps) {
  const province = CANADIAN_PROVINCES.find(p => p.code === profile.province);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Review Your Profile</h2>
        <p className="text-sm text-slate-600">Make sure everything looks good before submitting</p>
      </div>

      <div className="bg-slate-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Business Name</h3>
          <p className="text-base font-semibold text-slate-900">{profile.businessName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Phone</h3>
            <p className="text-base text-slate-900">{profile.phoneNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Years in Business</h3>
            <p className="text-base text-slate-900">{profile.yearsInBusiness}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Address</h3>
          <p className="text-base text-slate-900">
            {profile.address}
            {profile.unit && `, ${profile.unit}`}
            <br />
            {profile.city}, {province?.code} {profile.postalCode}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-1">Services Offered</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.serviceTypes.map((service: string) => (
              <span
                key={service}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {profile.mobileService && (
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Mobile Service</h3>
            <p className="text-base text-slate-900">
              ✓ Available • {profile.serviceRadius} km radius
            </p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">You're almost ready to start!</p>
            <p>After completing setup, you'll be able to browse service requests and submit quotes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
