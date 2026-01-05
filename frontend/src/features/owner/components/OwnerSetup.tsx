import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useVehicles } from '@/features/vehicles/hooks/use-vehicles';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { StepProgress } from '@/routes/owner/-components/StepProgress';
import { ProfileStep } from '@/routes/owner/-components/ProfileStep';
import { VehicleStep } from '@/routes/owner/-components/VehicleStep';
import { ReviewStep } from '@/routes/owner/-components/ReviewStep';
import { useVehicleData } from '@/routes/owner/-components/useVehicleData';

export function OwnerSetup() {
  const navigate = useNavigate();
  const { createVehicle, isCreating } = useVehicles();
  const { updateProfile, isUpdatingProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
    mileage: 0,
    mileageUnit: 'miles' as 'miles' | 'km',
    vin: '',
  });

  const {
    carMakes,
    carModels,
    isLoadingMakes,
    isLoadingModels,
    isDecodingVin,
    decodeVin,
  } = useVehicleData(vehicle.make);

  const handleVinChange = async (vin: string) => {
    setVehicle((prev) => ({ ...prev, vin }));
    if (vin.length === 17) {
      const decodedData = await decodeVin(vin);
      if (decodedData) {
        setVehicle((prev) => ({ ...prev, ...decodedData }));
      }
    }
  };

  const handleComplete = async () => {
    try {
      console.log('Updating profile with:', { ...profile, onboardingComplete: true });
      await updateProfile({
        ...profile,
        onboardingComplete: true,
      });
      console.log('Profile updated successfully');

      console.log('Creating vehicle with:', {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        mileage: vehicle.mileage,
        ...(vehicle.vin && vehicle.vin.length === 17 ? { vin: vehicle.vin } : {}),
      });
      await createVehicle({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        licensePlate: vehicle.licensePlate,
        color: vehicle.color,
        mileage: vehicle.mileage,
        ...(vehicle.vin && vehicle.vin.length === 17 ? { vin: vehicle.vin } : {}),
      });
      console.log('Vehicle created successfully');

      console.log('Navigating to dashboard');
      navigate({ to: '/owner/dashboard' });
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full my-auto">
        <StepProgress
          currentStep={step}
          steps={['Profile', 'Vehicle', 'Review']}
        />

        {step === 1 && (
          <ProfileStep
            profile={profile}
            onProfileChange={setProfile}
            onSubmit={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <VehicleStep
            vehicle={vehicle}
            onVehicleChange={setVehicle}
            carMakes={carMakes}
            carModels={carModels}
            isLoadingMakes={isLoadingMakes}
            isLoadingModels={isLoadingModels}
            isDecodingVin={isDecodingVin}
            onVinChange={handleVinChange}
            onSubmit={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <ReviewStep
            profile={profile}
            vehicle={vehicle}
            isLoading={isCreating || isUpdatingProfile}
            onBack={() => setStep(2)}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
