import { Link } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import React from 'react';

interface AuthFormLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  role?: string;
}

/**
 * Shared layout for auth forms (login/signup)
 */
export function AuthFormLayout({ children, title, subtitle, role }: AuthFormLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="w-full shadow-xl border-slate-200/60 h-full flex flex-col" padding="xl">
        {/* Role Context Badge */}
        {role === 'provider' && (
          <div className="mb-6 -mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Signing in as a mechanic</span>
              </div>
              <Link
                to="/auth/login"
                className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
              >
                Not a mechanic?
              </Link>
            </div>
          </div>
        )}

        {/* Brand Stamp */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <svg className="w-7 h-7 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>

        {children}
      </Card>
    </motion.div>
  );
}
