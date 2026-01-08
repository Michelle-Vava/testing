import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  /**
   * Current image URLs to display
   */
  images?: string[];
  
  /**
   * Callback when new images are selected
   */
  onImagesSelected: (files: File[]) => void;
  
  /**
   * Callback when an image is removed
   */
  onImageRemove?: (imageUrl: string) => void;
  
  /**
   * Maximum number of images allowed
   */
  maxImages?: number;
  
  /**
   * Whether the component is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * ImageUpload component for uploading and managing images
 * 
 * Features:
 * - Drag and drop support
 * - Image preview with remove functionality
 * - File validation (type and size)
 * - Multiple image upload
 */
export function ImageUpload({
  images = [],
  onImagesSelected,
  onImageRemove,
  maxImages = 10,
  isLoading = false,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isLoading) {
      setIsDragging(true);
    }
  }, [disabled, isLoading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateAndProcessFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check total count
    const totalImages = images.length + previewUrls.length;
    const remainingSlots = maxImages - totalImages;

    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not an image`);
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds 5MB limit`);
        return;
      }

      // Check if we're within limits
      if (validFiles.length >= remainingSlots) {
        errors.push(`Can only upload ${remainingSlots} more image(s)`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      // Create preview URLs
      const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      
      // Notify parent component
      onImagesSelected(validFiles);
    }
  }, [images.length, previewUrls.length, maxImages, onImagesSelected]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isLoading) return;

      const files = e.dataTransfer.files;
      validateAndProcessFiles(files);
    },
    [disabled, isLoading, validateAndProcessFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      validateAndProcessFiles(files);
      
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [validateAndProcessFiles]
  );

  const handleRemovePreview = useCallback((index: number) => {
    setPreviewUrls((prev) => {
      const newUrls = [...prev];
      // Revoke object URL to free memory
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  }, []);

  const handleRemoveUploadedImage = useCallback(
    (imageUrl: string) => {
      if (onImageRemove) {
        onImageRemove(imageUrl);
      }
    },
    [onImageRemove]
  );

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-colors duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isLoading) {
            document.getElementById('file-input')?.click();
          }
        }}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
          disabled={disabled || isLoading}
          aria-label="Upload images"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            {isDragging ? (
              <span className="text-blue-600 font-medium">Drop images here</span>
            ) : (
              <>
                <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, WebP up to 5MB (max {maxImages} images)
          </p>
        </div>
      </div>

      {/* Image Previews */}
      {(images.length > 0 || previewUrls.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Uploaded Images */}
          {images.map((imageUrl, index) => (
            <div key={`uploaded-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {!disabled && !isLoading && onImageRemove && (
                <button
                  type="button"
                  onClick={() => handleRemoveUploadedImage(imageUrl)}
                  className="
                    absolute top-2 right-2
                    bg-red-500 text-white rounded-full p-1
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    hover:bg-red-600
                  "
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Preview Images (not yet uploaded) */}
          {previewUrls.map((url, index) => (
            <div key={`preview-${index}`} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-blue-300">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 flex items-center justify-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                ) : (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Ready to upload
                  </span>
                )}
              </div>
              {!isLoading && (
                <button
                  type="button"
                  onClick={() => handleRemovePreview(index)}
                  className="
                    absolute top-2 right-2
                    bg-red-500 text-white rounded-full p-1
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    hover:bg-red-600
                  "
                  aria-label="Remove preview"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {/* Empty slots indicator */}
          {Array.from({ length: Math.max(0, maxImages - images.length - previewUrls.length) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center"
            >
              <ImageIcon className="w-8 h-8 text-gray-300" />
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      <p className="text-sm text-gray-600">
        {images.length + previewUrls.length} / {maxImages} images
        {previewUrls.length > 0 && ` (${previewUrls.length} pending upload)`}
      </p>
    </div>
  );
}
