import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { CheckCircle } from 'lucide-react';

/**
 * Account Settings - Personal account management
 * 
 * SECTIONS:
 * 1. Personal Information (name, email - read-only)
 * 2. Security (password change placeholder)
 * 
 * NOTE: Email is read-only. Password reset requires support contact.
 */
export function AccountSettings() {
  const { user, updateProfile, isUpdatingProfile, refreshUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
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

  const handlePasswordReset = () => {
    alert('Password reset flow coming soon. Please log out and use "Forgot Password".');
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
            <Button variant="outline" onClick={handlePasswordReset}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
