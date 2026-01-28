import React from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  mode: 'owner' | 'provider';
  title: string;
  subtitle: string;
  isSignup?: boolean;
}

export function AuthSplitLayout({ children, mode, title, subtitle, isSignup = false }: AuthSplitLayoutProps) {
  const isProvider = mode === 'provider';
  
  // Back to home link
  const BackLink = () => (
    <div className={`absolute top-6 right-6 z-20 ${isProvider ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
      <Link to={isProvider ? "/providers" : "/"} className="flex items-center gap-2 text-sm font-medium transition-colors">
        <span>← Back to Home</span>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
      {/* Back Link Mobile (absolute top right) */}
      <div className="md:hidden">
        <BackLink />
      </div>

      {/* LEFT PANEL - Marketing/Context */}
      <div className={`
        relative w-full md:w-1/2 lg:w-3/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-hidden
        ${isProvider ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}
      `}>
        {/* Background Patterns */}
        {isProvider ? (
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 opacity-50">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-yellow-200/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
             <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4" />
          </div>
        )}

        <div className="relative z-10 max-w-xl mx-auto md:mx-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
             <div className="w-10 h-10 bg-[#F5B700] rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <svg className="w-6 h-6 text-[#0F172A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </div>
             <span className={`text-2xl font-bold ${isProvider ? 'text-white' : 'text-slate-900'}`}>Service Connect</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isProvider ? (
              <>
                 <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                   Win more jobs from verified service requests
                 </h1>
                 <p className="text-lg text-slate-300 mb-10">
                   Quote only on work you want. Manage your business with professional tools.
                 </p>
                 <ul className="space-y-4 mb-12">
                   {[
                     "Requests from real vehicle owners",
                     "Set your own pricing",
                     "No exclusivity"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3">
                       <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                         <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </span>
                       <span className="text-lg font-medium">{item}</span>
                     </li>
                   ))}
                 </ul>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                   Stop overpaying for car repairs
                 </h1>
                 <p className="text-lg text-slate-600 mb-10">
                   Get free, transparent quotes from verified providers locally.
                 </p>
                 <ul className="space-y-4 mb-12">
                   {[
                     "Verified providers",
                     "Quotes shared in-app",
                     "Compare before you decide"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center gap-3">
                       <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                         <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </span>
                       <span className="text-lg font-medium text-slate-800">{item}</span>
                     </li>
                   ))}
                 </ul>
              </>
            )}

            {/* Illustration Placeholder */}
            {isProvider ? (
               <div className="hidden lg:block relative h-64 w-full bg-slate-800/50 rounded-xl border border-slate-700 p-6 backdrop-blur-sm overflow-hidden transform rotate-1  translate-x-10 shadow-2xl">
                  {/* Mock UI for Dashboard request list */}
                  <div className="flex gap-4 border-b border-slate-700 pb-4 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-600"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-slate-600 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-8 w-20 bg-yellow-500 rounded"></div>
                  </div>
                  <div className="flex gap-4 border-b border-slate-700 pb-4 mb-4 opacity-70">
                    <div className="w-8 h-8 rounded-full bg-slate-600"></div>
                    <div className="flex-1">
                      <div className="h-4 w-40 bg-slate-600 rounded mb-2"></div>
                    </div>
                  </div>
                  <div className="flex gap-4 border-b border-slate-700 pb-4 mb-4 opacity-40">
                    <div className="w-8 h-8 rounded-full bg-slate-600"></div>
                    <div className="flex-1"></div>
                  </div>
               </div>
            ) : (
               <div className="hidden lg:block relative h-64 w-full">
                  {/* Simple sleek car illustration (CSS art style) */}
                  <div className="absolute inset-0 flex items-center justify-start transform translate-x-12">
                    <svg className="w-96 text-slate-300" viewBox="0 0 200 60" fill="currentColor">
                         {/* Simple abstract car */}
                         <path d="M10,40 L190,40 L180,25 L150,25 L135,10 L65,10 L50,25 L20,25 Z M35,55 A10,10 0 0,0 55,55 A10,10 0 0,0 35,55 M145,55 A10,10 0 0,0 165,55 A10,10 0 0,0 145,55" fillOpacity="0.8" />
                    </svg>
                  </div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-10">
                     <div className="bg-white p-4 rounded-lg shadow-xl border border-slate-100 w-48 rotate-[-6deg]">
                        <div className="h-2 w-20 bg-slate-200 rounded mb-2"></div>
                        <div className="h-6 w-16 bg-green-500 rounded mb-1"></div>
                        <div className="h-2 w-12 bg-slate-100 rounded"></div>
                     </div>
                  </div>
               </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL - Authentication Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 overflow-y-auto bg-white flex flex-col items-center justify-center p-6 md:p-12 relative">
        <div className="hidden md:block">
           <BackLink />
        </div>
        
        <div className="w-full max-w-md">
           <div className="mb-10 text-center md:text-left">
              <div className="inline-block p-3 rounded-xl bg-yellow-400 text-slate-900 mb-6 shadow-lg shadow-yellow-500/20">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-500">{subtitle}</p>
           </div>
           
           <div className="bg-white rounded-xl">
              {children}
           </div>
           
           {/* Context-aware footer link */}
           <div className="mt-8 pt-6 border-t border-slate-100 text-center md:text-left">
                <p className="text-sm text-slate-500">
                  {isSignup ? "Already have an account?" : "Don't have an account?"}
                  {' '}
                  <Link 
                    to={isSignup ? "/auth/login" : "/auth/signup"} 
                    search={{ mode }}
                    className="font-semibold text-yellow-600 hover:text-yellow-700"
                  >
                    {isSignup ? "Sign In" : "Create one"}
                  </Link>
                </p>
                
                {/* Subtle separate role link */}
                <div className="mt-4">
                  <Link 
                    to={isProvider ? "/auth/login?mode=owner" : "/auth/login?mode=provider"} 
                    className="text-xs text-slate-300 hover:text-slate-400"
                  >
                     {isProvider ? "Are you a vehicle owner?" : "Are you a provider?"}
                  </Link>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
