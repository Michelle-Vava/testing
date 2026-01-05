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
      <Footer />
    </div>
  );
}
