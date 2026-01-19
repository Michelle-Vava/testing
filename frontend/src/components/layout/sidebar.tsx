import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  links: SidebarLink[];
  isPinned?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  links,
  isPinned = false,
  onToggle 
}) => {
  const location = useLocation();

  return (
    <aside className="w-full h-full bg-[#0F172A] border-r border-[#1E293B] flex flex-col overflow-hidden">
      {/* Branding */}
      <div className={clsx(
        "h-16 flex items-center border-b border-[#1E293B] overflow-hidden transition-all duration-300",
        isPinned ? "px-6" : "px-4"
      )}>
        <div className="flex items-center gap-3 min-w-max">
          <div className="bg-[#F5B700] text-[#0F172A] p-2 rounded-lg shadow-lg shadow-yellow-500/20 shrink-0 ring-1 ring-white/10">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className={clsx(
            "font-bold text-xl text-[#FFFFFF] transition-all duration-300 origin-left whitespace-nowrap",
            isPinned ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            Shanda
          </span>
        </div>
      </div>

      <nav className="p-3 space-y-2 flex-1 overflow-y-auto overflow-x-hidden">
        {links.map((link) => {
          const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group/link relative',
                isActive
                  ? 'bg-[#F5B700] text-[#0F172A] shadow-md shadow-yellow-500/10'
                  : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-[#FFFFFF]'
              )}
            >
              <span className={clsx(
                "shrink-0 transition-colors flex justify-center w-6",
                isActive ? 'text-[#0F172A]' : 'text-[#94A3B8]'
              )}>
                {link.icon}
              </span>
              
              <span className={clsx(
                "transition-all duration-300 origin-left whitespace-nowrap overflow-hidden",
                isPinned ? "opacity-100 w-auto" : "opacity-0 w-0"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button - Icon Only */}
      {onToggle && (
        <div className="p-3 border-t border-[#1E293B] mt-auto">
          <button
            onClick={onToggle}
            className={clsx(
              "w-full flex items-center justify-center px-3 py-2 rounded-lg text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-colors"
            )}
            title={isPinned ? "Collapse navigation" : "Keep navigation open"}
          >
           {isPinned ? <ChevronsLeft className="w-5 h-5 shrink-0" /> : <ChevronsRight className="w-5 h-5 shrink-0" />}
          </button>
        </div>
      )}
    </aside>
  );
};
