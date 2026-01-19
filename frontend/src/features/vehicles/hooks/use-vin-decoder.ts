import { useState } from 'react';
import { decodeVIN, COMMON_MAKES, type VINDecodeResult } from '../utils/vin-decoder';

/**
 * Custom hook for manual VIN decoding via button click
 * 
 * @returns { isDecoding, result, decode }
 */
export function useVINDecoder() {
  const [isDecoding, setIsDecoding] = useState(false);
  const [result, setResult] = useState<VINDecodeResult | null>(null);

  const decode = async (vin: string): Promise<{ make: string; model: string; year: string } | null> => {
    if (vin.length !== 17) {
      setResult({
        success: false,
        error: 'VIN must be exactly 17 characters',
      });
      return null;
    }

    setIsDecoding(true);
    setResult(null);

    try {
      const decodeResult = await decodeVIN(vin);
      setResult(decodeResult);

      if (decodeResult.success) {
        // Normalize make to match dropdown options
        let normalizedMake = decodeResult.make || '';
        if (normalizedMake) {
          const matchedMake = COMMON_MAKES.find(
            (m) => m.toLowerCase() === normalizedMake!.toLowerCase()
          );
          normalizedMake = matchedMake || normalizedMake;
        }

        const data = {
          make: normalizedMake,
          model: decodeResult.model || '',
          year: decodeResult.year ? String(decodeResult.year) : '',
        };

        return data;
      }
      return null;
    } catch (error) {
      console.error('VIN decode failed:', error);
      setResult({
        success: false,
        error: 'Failed to decode VIN. Please enter details manually.',
      });
      return null;
    } finally {
      setIsDecoding(false);
    }
  };

  return { isDecoding, result, decode };
}
