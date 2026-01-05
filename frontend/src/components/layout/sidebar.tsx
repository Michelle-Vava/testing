import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
}

export const Sidebar: React.FC<SidebarProps> = ({ links }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] min-h-screen">
      {/* Branding */}
      <div className="h-16 px-6 border-b border-[#1E293B] flex items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#F5B700] text-[#0F172A] p-1.5 rounded shadow-lg shadow-yellow-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-[#FFFFFF]">Shanda</span>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#F5B700] text-[#0F172A]'
                  : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#FFFFFF]'
              )}
            >
              <span className={isActive ? 'text-[#0F172A]' : 'text-[#94A3B8]'}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
