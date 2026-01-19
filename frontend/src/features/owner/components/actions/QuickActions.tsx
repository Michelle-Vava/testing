import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Car, Settings } from 'lucide-react';

interface QuickActionsProps {
  hasVehicles: boolean;
}

export function QuickActions({ hasVehicles }: QuickActionsProps) {
  return (
    <Card className="shadow-md border border-slate-200 bg-white">
      <CardContent className="p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h2>
        <div className="space-y-2">
          {/* Primary Action */}
          {hasVehicles ? (
            <Link
              to="/owner/requests/new"
              search={{ serviceType: undefined, providerId: undefined }}
              className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors group"
            >
              <div className="p-2 bg-yellow-500 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
                <Wrench className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Create Request</p>
                <p className="text-sm text-slate-600">Get quotes from mechanics</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 opacity-75 cursor-not-allowed">
              <div className="p-2 bg-slate-300 rounded-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-500">Create Request</p>
                <p className="text-sm text-slate-500">Add a vehicle to request quotes</p>
              </div>
            </div>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Link
              to="/owner/vehicles"
              className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                <Car className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Manage Vehicles</p>
                <p className="text-sm text-slate-600">Add or edit vehicles</p>
              </div>
            </Link>

            <Link
              to="/owner/settings"
              className="flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Settings</p>
                <p className="text-sm text-slate-600">Update your profile</p>
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
