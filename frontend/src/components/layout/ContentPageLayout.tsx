import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { Footer } from '@/components/layout/footer';

interface ContentPageLayoutProps {
  children: ReactNode;
  title: string;
  titleHighlight?: string;
  lastUpdated?: string;
  showBackLink?: boolean;
}

export function ContentPageLayout({ 
  children, 
  title, 
  titleHighlight,
  lastUpdated,
  showBackLink = true 
}: ContentPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          {title}{' '}
          {titleHighlight && <span className="text-yellow-500">{titleHighlight}</span>}
        </h1>
        
        {lastUpdated && (
          <p className="text-sm text-slate-600 mb-8">Last updated: {lastUpdated}</p>
        )}
        
        <div className="prose prose-lg max-w-none bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          {children}
        </div>
        
        {showBackLink && (
          <div className="mt-12 pt-8 border-t border-slate-300">
            <Link to="/" className="text-slate-900 hover:text-slate-700 hover:underline">
              ← Back to Home
            </Link>
          </div>
        )}
      </div>

      <section className="bg-[#1E293B] py-16 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Fair prices for everyone.
        </h2>
        <Link 
          to="/auth/signup" 
          search={{ mode: 'owner' }}
          className="inline-block bg-[#F5B700] text-[#0F172A] hover:bg-yellow-400 px-8 py-3 rounded-lg font-bold shadow-lg shadow-yellow-500/20 hover:-translate-y-0.5 transition-all"
        >
          Get Started
        </Link>
      </section>

      <Footer />
    </div>
  );
}
