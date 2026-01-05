import React from 'react';
import { Info, Loader2, AlertCircle } from 'lucide-react';
import { type VINDecodeResult } from '@/features/vehicles/utils/vin-decoder';

interface VINInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  isDecoding?: boolean;
  decodeResult?: VINDecodeResult | null;
}

/**
 * VIN input field with decoder status and help tooltip
 */
export function VINInput({
  value,
  onChange,
  onBlur,
  error,
  touched,
  isDecoding,
  decodeResult
}: VINInputProps) {
  const hasError = error && touched;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-slate-700">
          VIN (Recommended)
        </label>
        <div className="group relative">
          <Info className="w-4 h-4 text-slate-400 cursor-help" />
          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-10">
            Enter your VIN to automatically fill vehicle details. Works for Canadian and US vehicles.
          </div>
        </div>
        {isDecoding && (
          <div className="flex items-center gap-1 text-xs text-blue-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Decoding...</span>
          </div>
        )}
      </div>

      <input
        type="text"
        name="vin"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={17}
        className={`w-full px-4 py-3 border rounded-lg transition-all font-mono text-sm ${
          hasError
            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500'
        }`}
        placeholder="1HGBH41JXMN109186"
      />

      {/* Error State */}
      {hasError && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {/* Decode Failed */}
      {decodeResult && !decodeResult.success && (
        <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {decodeResult.errorText} - You can still enter details manually
        </p>
      )}

      {/* Decode Success */}
      {value && !error && value.length === 17 && decodeResult?.success && (
        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
          ✓ VIN decoded successfully! Details auto-filled below.
        </p>
      )}
    </div>
  );
}
