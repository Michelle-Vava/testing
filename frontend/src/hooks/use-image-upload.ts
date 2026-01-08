import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AXIOS_INSTANCE } from '@/lib/axios';
import { toast } from 'sonner';

interface UploadImagesParams {
  entityId: string;
  entityType: 'vehicle' | 'request';
  files: File[];
}

interface DeleteImageParams {
  entityId: string;
  entityType: 'vehicle' | 'request';
  imageUrl: string;
}

/**
 * Hook for handling image uploads to vehicles and service requests
 */
export function useImageUpload() {
  const queryClient = useQueryClient();

  // Upload images mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ entityId, entityType, files }: UploadImagesParams) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const endpoint = entityType === 'vehicle' 
        ? `/vehicles/${entityId}/images`
        : `/requests/${entityId}/images`;

      const response = await AXIOS_INSTANCE.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    },
    onSuccess: (_, { entityType, entityId }) => {
      // Invalidate relevant queries
      if (entityType === 'vehicle') {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        queryClient.invalidateQueries({ queryKey: ['vehicle', entityId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        queryClient.invalidateQueries({ queryKey: ['request', entityId] });
      }
      
      toast.success('Images uploaded successfully');
    },
    onError: (error: any) => {
      console.error('Failed to upload images:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ entityId, entityType, imageUrl }: DeleteImageParams) => {
      const endpoint = entityType === 'vehicle'
        ? `/vehicles/${entityId}/images`
        : `/requests/${entityId}/images`;

      const response = await AXIOS_INSTANCE.delete(endpoint, {
        data: { imageUrl },
      });

      return response.data;
    },
    onSuccess: (_, { entityType, entityId }) => {
      // Invalidate relevant queries
      if (entityType === 'vehicle') {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        queryClient.invalidateQueries({ queryKey: ['vehicle', entityId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['requests'] });
        queryClient.invalidateQueries({ queryKey: ['request', entityId] });
      }
      
      toast.success('Image deleted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to delete image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    },
  });

  return {
    uploadImages: uploadMutation.mutateAsync,
    deleteImage: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
