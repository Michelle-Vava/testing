import { Footer } from '@/components/layout/footer';
import { Link } from '@tanstack/react-router';
import { RecentRequestsSection } from '@/features/requests/components/sections/RecentRequestsSection';
import { useLandingData, getUrgencyColor } from '../hooks/use-landing-data';

// Reusing existing components where applicable or defining simple new ones
function ProviderHeroSection() {
  return (
    <section className="bg-[#0F172A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#F5B700] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#FFFFFF] mb-6 tracking-tight leading-tight">
          Get More Jobs. <br/>
          <span className="text-[#F5B700]">No Cold Calling.</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#94A3B8] mb-10 max-w-2xl mx-auto leading-relaxed">
          Receive verified service requests and send quotes directly to drivers in your area.
          Grow your business on your terms.
          <br/>
          <span className="text-base text-slate-500 mt-2 block">No subscriptions. You only quote on jobs you want.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/signup"
            search={{ mode: 'provider' }}
            onClick={() => sessionStorage.setItem('landingPage', '/providers')}
            className="bg-[#F5B700] text-[#0F172A] hover:bg-yellow-400 px-8 py-4 rounded-xl text-lg font-bold transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/20"
          >
            Apply as a Provider
          </Link>
          <Link
            to="/auth/login"
            search={{ mode: 'provider' }}
            onClick={() => sessionStorage.setItem('landingPage', '/providers')}
            className="bg-[#1E293B] text-[#FFFFFF] border border-[#334155] hover:bg-[#334155] px-8 py-4 rounded-xl text-lg font-semibold transition-all"
          >
            Provider Sign In
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[#64748B]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Verified Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No Subscriptions</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProviderHowItWorks() {
  const steps = [
    {
      title: "Apply & Verify",
      description: "Create your profile, upload your credentials, and get verified to build trust with customers.",
      icon: (
        <svg className="w-8 h-8 text-[#F5B700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Get Matched",
      description: "We send you service requests from local drivers that match your expertise and services.",
      icon: (
        <svg className="w-8 h-8 text-[#F5B700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      title: "Quote & Win",
      description: "Review details, send your best quote, and win jobs. Manage everything in one dashboard.",
      icon: (
        <svg className="w-8 h-8 text-[#F5B700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">How It Works for Providers</h2>
          <p className="mt-4 text-xl text-slate-600">Simpler workflow, better jobs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full relative z-10">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProviderFeatures() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why providers choose Shanda</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Control Your Pricing</h3>
                  <p className="text-slate-600 mt-1">Set your own rates and quote based on the specific job details. No fixed platform pricing.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Fill Your Schedule</h3>
                  <p className="text-slate-600 mt-1">Use the platform to fill gaps in your schedule or build your entire business.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Verified Trust</h3>
                  <p className="text-slate-600 mt-1">We verify credentials so you can stand out as a trusted professional.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200">
             {/* Abstract UI representation */}
             <div className="bg-white rounded-xl shadow-lg p-6 mb-4 transform -rotate-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-20 h-4 bg-slate-200 rounded"></div>
                  <div className="w-16 h-6 bg-yellow-100 rounded-full"></div>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded mb-2"></div>
                <div className="w-2/3 h-4 bg-slate-100 rounded"></div>
             </div>
             <div className="bg-white rounded-xl shadow-lg p-6 transform rotate-1 translate-x-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  <div className="w-20 h-8 bg-blue-600 rounded"></div>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProviderLanding() {
  const { requests, requestsLoading, requestsError } = useLandingData();

  return (
    <div className="min-h-screen bg-white">
      <ProviderHeroSection />
      
      <div className="bg-slate-50 py-4">
        <RecentRequestsSection
          requests={requests}
          loading={requestsLoading}
          error={requestsError as Error | null}
          getUrgencyColor={getUrgencyColor}
        />
      </div>

      <ProviderHowItWorks />
      <ProviderFeatures />
      
      {/* CTA Section */}
      <section className="bg-[#1E293B] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Ready to grow your business?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
          Join thousands of top-rated mechanics and service providers on Shanda.
        </p>
        <Link
          to="/auth/signup"
          search={{ mode: 'provider' }}
          onClick={() => sessionStorage.setItem('landingPage', '/providers')}
          className="bg-[#F5B700] text-[#0F172A] hover:bg-yellow-400 px-8 py-4 rounded-xl text-lg font-bold transition-all inline-block"
        >
          Apply Now
        </Link>
      </section>

      <Footer />
    </div>
  );
}
