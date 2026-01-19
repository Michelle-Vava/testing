import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ImageUpload } from '@/features/upload/components/ImageUpload';
import { CheckCircle, Save, Loader2 } from 'lucide-react';

type BusinessProfileFormValues = {
  businessName: string;
  phoneNumber: string;
  website: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  serviceRadius: number;
  yearsInBusiness: number;
  hourlyRate: number;
  shopPhotos: string[];
  serviceTypes: string[];
  isMobileService: boolean;
  isShopService: boolean;
};

// Available service types (synced with onboarding)
const AVAILABLE_SERVICES = [
  'Oil Change',
  'Brake Service',
  'Tire Rotation',
  'Battery Replacement',
  'Engine Diagnostic',
  'General Maintenance',
  'Detailing',
  'Inspection'
];

/**
 * Business Settings - Provider business profile management
 * 
 * SECTIONS:
 * 1. Business Details (name, phone, website, bio)
 * 2. Shop Photos (ImageUpload with max 6 images)
 * 3. Services & Coverage (checkboxes, mobile/shop flags)
 * 4. Location Details (address, service radius)
 * 
 * FORM STRATEGY:
 * - Uses react-hook-form with Controller for complex inputs
 * - Auto-saves to updateProfile() hook
 * - Shows success message for 3 seconds after save
 */
export function BusinessSettings() {
  const { user, updateProfile, isUpdatingProfile, refreshUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, control, handleSubmit, formState: { errors, isDirty }, reset, setValue, watch } = useForm<BusinessProfileFormValues>({
    defaultValues: {
      businessName: '',
      phoneNumber: '',
      website: '',
      bio: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      serviceRadius: 25,
      yearsInBusiness: 0,
      hourlyRate: 0,
      shopPhotos: [],
      serviceTypes: [],
      isMobileService: false,
      isShopService: true,
    }
  });

  const selectedServices = watch('serviceTypes');

  const handleImageUpload = async (files: File[]) => {
    // Simulating upload by creating local object URLs
    // In production, this would use a proper upload service
    const newUrls = files.map(file => URL.createObjectURL(file));
    const currentPhotos = watch('shopPhotos') || [];
    setValue('shopPhotos', [...currentPhotos, ...newUrls], { shouldDirty: true });
  };

  const handleImageRemove = (urlToRemove: string) => {
    const currentPhotos = watch('shopPhotos') || [];
    setValue('shopPhotos', currentPhotos.filter(url => url !== urlToRemove), { shouldDirty: true });
  };

  useEffect(() => {
    if (user) {
      reset({
        businessName: user.businessName || '',
        phoneNumber: user.phone || '',
        website: (user as any).website || '',
        bio: user.bio || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        serviceRadius: (user as any).serviceRadius || 25,
        yearsInBusiness: user.yearsInBusiness || 0,
        hourlyRate: (user as any).hourlyRate || 0,
        shopPhotos: user.shopPhotos || [],
        serviceTypes: user.serviceTypes || [],
        isMobileService: user.isMobileService || false,
        isShopService: user.isShopService || true,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: BusinessProfileFormValues) => {
    try {
      setSuccessMessage('');
      await updateProfile({
        ...data,
        phoneNumber: data.phoneNumber,
      });
      await refreshUser();
      setSuccessMessage('Business profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg mb-4">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>This information is visible to customers on your quotes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" {...register('businessName', { required: 'Required' })} />
              {errors.businessName && <p className="text-red-500 text-xs">{errors.businessName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Business Phone</Label>
              <Input id="phoneNumber" {...register('phoneNumber', { required: 'Required' })} />
              {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" {...register('website')} placeholder="https://" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsInBusiness">Years in Business</Label>
              <Input type="number" id="yearsInBusiness" {...register('yearsInBusiness', { min: 0 })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">About Your Business</Label>
            <Textarea 
              id="bio" 
              {...register('bio')} 
              className="min-h-[100px]" 
              placeholder="Describe your expertise, certifications, and what makes your shop special."
            />
          </div>
        </CardContent>
      </Card>

      {/* Shop Photos Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Photos</CardTitle>
          <CardDescription>Upload photos of your shop, equipment, or past work. Profiles with photos get 2x more requests.</CardDescription>
        </CardHeader>
        <CardContent>
           <Controller
             name="shopPhotos"
             control={control}
             render={({ field }) => (
               <ImageUpload
                  images={field.value}
                  onImagesSelected={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  maxImages={6}
               />
             )}
           />
        </CardContent>
      </Card>

      {/* Services & Coverage Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Coverage</CardTitle>
          <CardDescription>Define what services you offer and where you work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Service Types */}
          <div className="space-y-3">
             <Label className="text-base font-semibold">Services Offered</Label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {AVAILABLE_SERVICES.map((type) => (
                 <label
                   key={type}
                   className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                     selectedServices?.includes(type)
                       ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
                       : 'border-slate-200 hover:border-slate-300'
                   }`}
                 >
                   <input 
                     type="checkbox"
                     className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                     checked={selectedServices?.includes(type) || false}
                     onChange={(e) => {
                        const checked = e.target.checked;
                        const current = selectedServices || [];
                        if (checked) {
                          setValue('serviceTypes', [...current, type], { shouldDirty: true });
                        } else {
                          setValue('serviceTypes', current.filter(t => t !== type), { shouldDirty: true });
                        }
                     }}
                   />
                   <span className="text-sm font-medium text-slate-700">{type}</span>
                 </label>
               ))}
             </div>
          </div>

          <div className="border-t pt-4 space-y-4">
             <Label className="text-base font-semibold">Service Options</Label>
             <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="isShopService"
                    render={({ field }) => (
                      <input 
                        type="checkbox"
                        id="isShopService" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={field.value} 
                        onChange={(e) => field.onChange(e.target.checked)} 
                      />
                    )}
                  />
                  <label
                    htmlFor="isShopService"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I have a physical shop location (Customers come to me)
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="isMobileService"
                    render={({ field }) => (
                      <input 
                        type="checkbox"
                        id="isMobileService" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={field.value} 
                        onChange={(e) => field.onChange(e.target.checked)} 
                      />
                    )}
                  />
                  <label
                    htmlFor="isMobileService"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I offer mobile service (I go to customers)
                  </label>
                </div>
             </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
          <CardDescription>Where is your business located?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
               <Label htmlFor="address">Street Address</Label>
               <Input id="address" {...register('address')} placeholder="123 Main St" />
            </div>
            <div className="space-y-2">
               <Label htmlFor="city">City</Label>
               <Input id="city" {...register('city')} />
            </div>
            <div className="space-y-2">
               <Label htmlFor="state">State</Label>
               <Input id="state" {...register('state')} maxLength={2} placeholder="CA" />
            </div>
            <div className="space-y-2">
               <Label htmlFor="zipCode">Zip Code</Label>
               <Input id="zipCode" {...register('zipCode')} />
            </div>
            <div className="space-y-2">
               <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
               <Input type="number" id="serviceRadius" {...register('serviceRadius')} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
           <Button type="submit" disabled={isUpdatingProfile || !isDirty}>
            {isUpdatingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
