import { useEffect, useState } from 'react';

interface VehicleData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  mileage: number;
  vin: string;
}

interface UseVehicleDataReturn {
  carMakes: { value: string; label: string }[];
  carModels: { value: string; label: string }[];
  isLoadingMakes: boolean;
  isLoadingModels: boolean;
  isDecodingVin: boolean;
  decodeVin: (vin: string) => Promise<Partial<VehicleData> | null>;
}

/**
 * Centralized hook for vehicle data from NHTSA API
 * Fetches car makes, models, and VIN decoding
 * Used across owner onboarding and vehicle management
 */
export function useVehicleData(vehicleMake: string): UseVehicleDataReturn {
  const [carMakes, setCarMakes] = useState<{ value: string; label: string }[]>([]);
  const [carModels, setCarModels] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingMakes, setIsLoadingMakes] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isDecodingVin, setIsDecodingVin] = useState(false);

  // Fetch car makes from NHTSA API
  useEffect(() => {
    const fetchMakes = async () => {
      setIsLoadingMakes(true);
      try {
        const response = await fetch(
          'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json'
        );
        const data = await response.json();
        const makes = data.Results.map((item: { MakeName: string }) => ({
          value: item.MakeName,
          label: item.MakeName,
        })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));

        setCarMakes([...makes, { value: 'Other', label: 'Other' }]);
      } catch (error) {
        console.error('Failed to fetch car makes:', error);
        // Fallback to basic list
        setCarMakes([
          { value: 'Toyota', label: 'Toyota' },
          { value: 'Honda', label: 'Honda' },
          { value: 'Ford', label: 'Ford' },
          { value: 'Chevrolet', label: 'Chevrolet' },
          { value: 'Nissan', label: 'Nissan' },
          { value: 'Other', label: 'Other' },
        ]);
      } finally {
        setIsLoadingMakes(false);
      }
    };

    fetchMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!vehicleMake || vehicleMake === 'Other') {
        setCarModels([{ value: 'Other', label: 'Other' }]);
        return;
      }

      setIsLoadingModels(true);
      try {
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(
            vehicleMake
          )}?format=json`
        );
        const data = await response.json();
        const models = data.Results.map((item: { Model_Name: string }) => ({
          value: item.Model_Name,
          label: item.Model_Name,
        })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));

        setCarModels([...models, { value: 'Other', label: 'Other' }]);
      } catch (error) {
        console.error('Failed to fetch car models:', error);
        setCarModels([{ value: 'Other', label: 'Other' }]);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [vehicleMake]);

  // VIN decoder function
  const decodeVin = async (vin: string): Promise<Partial<VehicleData> | null> => {
    if (vin.length !== 17) return null;

    setIsDecodingVin(true);
    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
      );
      const data = await response.json();

      const results = data.Results;
      const make = results.find((r: { Variable: string; Value: string }) => r.Variable === 'Make')?.Value;
      const model = results.find((r: { Variable: string; Value: string }) => r.Variable === 'Model')?.Value;
      const year = results.find((r: { Variable: string; Value: string }) => r.Variable === 'Model Year')?.Value;

      if (make && model && year) {
        return {
          make,
          model,
          year: parseInt(year),
          vin,
        };
      }
      return null;
    } catch (error) {
      console.error('VIN decode failed:', error);
      return null;
    } finally {
      setIsDecodingVin(false);
    }
  };

  return {
    carMakes,
    carModels,
    isLoadingMakes,
    isLoadingModels,
    isDecodingVin,
    decodeVin,
  };
}
