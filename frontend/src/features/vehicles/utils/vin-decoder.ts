/**
 * VIN Decoder using NHTSA API
 * Works for Canadian and US vehicles
 */

export interface VINDecodeResult {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  errorCode?: string;
  errorText?: string;
  success: boolean;
}

export async function decodeVIN(vin: string): Promise<VINDecodeResult> {
  if (!vin || vin.length !== 17) {
    return {
      success: false,
      errorText: 'VIN must be exactly 17 characters',
    };
  }

  try {
    // NHTSA API works for both Canadian and US vehicles
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
    );

    if (!response.ok) {
      throw new Error('Failed to decode VIN');
    }

    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      return {
        success: false,
        errorText: 'Unable to decode VIN',
      };
    }

    // Extract relevant fields from NHTSA response
    const results = data.Results;
    const getValue = (variableId: number) => {
      const item = results.find((r: any) => r.VariableId === variableId);
      return item?.Value || '';
    };

    const make = getValue(26); // Make
    const model = getValue(28); // Model
    const yearStr = getValue(29); // Model Year
    const year = yearStr ? parseInt(yearStr) : undefined;

    // Check if we got valid data
    if (!make && !model && !year) {
      return {
        success: false,
        errorText: 'VIN decoded but no vehicle information found',
      };
    }

    return {
      success: true,
      make: make || undefined,
      model: model || undefined,
      year: year || undefined,
    };
  } catch (error) {
    console.error('VIN decode error:', error);
    return {
      success: false,
      errorText: 'Failed to decode VIN. Please check your connection.',
    };
  }
}

/**
 * Common vehicle makes for dropdown
 */
export const COMMON_MAKES = [
  'Acura',
  'Audi',
  'BMW',
  'Buick',
  'Cadillac',
  'Chevrolet',
  'Chrysler',
  'Dodge',
  'Ford',
  'GMC',
  'Honda',
  'Hyundai',
  'Infiniti',
  'Jeep',
  'Kia',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Nissan',
  'Ram',
  'Subaru',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
].sort();
