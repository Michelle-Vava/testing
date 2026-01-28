import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';

interface AuthLayoutProps {
  children: ReactNode;
  mode: 'owner' | 'provider';
  title: string;
  subtitle: string;
  features: string[];
  illustration?: ReactNode;
}

export function AuthLayout({ children, mode, title, subtitle, features, illustration }: AuthLayoutProps) {
  const isProvider = mode === 'provider';
  
  // Styles based on mode
  const moodColor = isProvider ? 'slate' : 'blue';
  const bgColor = 'bg-white'; // Unified background
  const textColor = isProvider ? 'text-white' : 'text-slate-900';
  const accentColor = isProvider ? 'text-[#F5B700]' : 'text-blue-600';
  const checkColor = isProvider ? 'text-green-400' : 'text-green-500';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${bgColor}`}>
      {/* Left Panel - Marketing/Context */}
      <div className={`w-full md:w-1/2 lg:w-3/5 p-8 md:p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden ${isProvider ? 'bg-[url("https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")] bg-cover bg-center' : 'bg-slate-50'}`}>
        
        {/* Overlay for provider background image */}
        {isProvider && <div className="absolute inset-0 bg-slate-900/90 mix-blend-multiply" />}
        
        <div className="relative z-10 max-w-2xl">
          <Link to={isProvider ? "/providers" : "/"} className="inline-flex items-center gap-2 mb-12 hover:opacity-80 transition-opacity">
            <div className={`w-10 h-10 ${isProvider ? 'bg-[#F5B700] text-slate-900' : 'bg-[#F5B700] text-slate-900'} rounded-lg flex items-center justify-center shadow-lg`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight ${textColor}`}>
              {title}
            </h1>
            <p className={`text-xl mb-12 max-w-lg ${isProvider ? 'text-slate-300' : 'text-slate-600'}`}>
              {subtitle}
            </p>

            <div className="space-y-6 mb-12">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  className="flex items-center gap-4"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isProvider ? 'bg-slate-800' : 'bg-green-100'}`}>
                    <svg className={`w-4 h-4 ${checkColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-lg font-medium ${isProvider ? 'text-slate-200' : 'text-slate-700'}`}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            {illustration && (
              <div className="mt-8 hidden lg:block">
                {illustration}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 p-4 md:p-12 overflow-y-auto flex items-center justify-center bg-white relative">
        <div className="absolute top-6 right-6">
          <Link 
            to={isProvider ? "/providers" : "/"} 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}
