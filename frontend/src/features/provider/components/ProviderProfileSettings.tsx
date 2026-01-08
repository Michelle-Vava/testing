import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { CheckCircle, AlertCircle, Save, Loader2, User as UserIcon, Building, Bell } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Business Settings Component ---
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
};

function BusinessSettings() {
  const { user, updateProfile, isUpdatingProfile, refreshUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<BusinessProfileFormValues>({
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
    }
  });

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

      <Card>
        <CardHeader>
          <CardTitle>Service Area & Location</CardTitle>
          <CardDescription>Where do you provide services?</CardDescription>
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

// --- Account Settings Component ---
function AccountSettings() {
  const { user, updateProfile, isUpdatingProfile, refreshUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '', // Read only
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: { name: string }) => {
    try {
      await updateProfile({ name: data.name });
      await refreshUser();
      setSuccessMessage('Account details updated');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
       {successMessage && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Manage your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <form id="account-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="name">Full Name</Label>
               <Input id="name" {...register('name', { required: 'Name is required' })} />
               {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
             </div>
             <div className="space-y-2">
               <Label htmlFor="email">Email Address</Label>
               <Input id="email" {...register('email')} disabled className="bg-gray-100 text-gray-500" />
               <p className="text-xs text-gray-500">To change your email, please contact support.</p>
             </div>
           </form>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-4 flex justify-end">
           <Button type="submit" form="account-form" disabled={isUpdatingProfile || !isDirty}>
            {isUpdatingProfile ? 'Saving...' : 'Update Account'}
           </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed: Never</p>
            </div>
            <Button variant="outline" onClick={() => alert('Password reset flow coming soon. Please log out and use "Forgot Password".')}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Wrapper Component ---
export function ProviderProfileSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="business">
            <BusinessSettings />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mb-4 text-gray-300" />
                  <p>Notification settings are coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
