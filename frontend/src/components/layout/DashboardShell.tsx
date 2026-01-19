import React, { useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { useUIStore } from '@/lib/store';
import clsx from 'clsx';

interface DashboardShellProps {
  children: React.ReactNode;
  header: React.ReactNode;
  sidebarLinks: Array<{
    to: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

export function DashboardShell({ children, header, sidebarLinks }: DashboardShellProps) {
  // Option 1: Rail Mode with Toggle
  // Sidebar has 2 states: 
  // 1. Unpinned (Collapsed): Width 20. Icons only.
  // 2. Pinned (Expanded): Width 72. Full width.
  // Default: Collapsed (false)
  
  const { sidebarPinned: isPinned, setSidebarPinned: setIsPinned } = useUIStore();

  
  return (
    <div className="flex min-h-[100dvh] bg-slate-50">
      {/* Fixed Sidebar Container */}
      <div 
        className={clsx(
          "fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ease-in-out bg-[#0F172A]",
          isPinned 
            ? "w-72 shadow-xl" // Pinned: Wide, fixed
            : "w-20" // Unpinned: Rail, no hover expansion
        )}
      >
        <Sidebar 
          links={sidebarLinks} 
          isPinned={isPinned}
          onToggle={() => setIsPinned(!isPinned)}
        />
      </div>

      {/* Main Content Area */}
      <div 
        className={clsx(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          // Pinned: Content pushes over (pl-72)
          // Unpinned: Content stays narrow (pl-20)
          isPinned ? "pl-72" : "pl-20"
        )}
      >
        {header}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
