'use client';

import * as React from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

import { compressImage } from '@/utils/image-compression';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    if (filesToUpload.length === 0) return;

    setIsUploading(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      const newImageUrls: string[] = [];

      for (const originalFile of filesToUpload) {
        // Compress the image before uploading!
        const file = await compressImage(originalFile);

        if (cloudName && uploadPreset) {
          // Real Cloudinary Upload
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) throw new Error('Upload failed');
          const data = await res.json();
          
          // Inject compression and optimization flags into Cloudinary URL
          // Changes /upload/v123... to /upload/f_auto,q_auto,w_1920,c_limit/v123...
          const optimizedUrl = data.secure_url.replace(
            '/upload/', 
            '/upload/f_auto,q_auto,w_1920,c_limit/'
          );
          
          newImageUrls.push(optimizedUrl);
        } else {
          throw new Error('Cloudinary environment variables (CLOUD_NAME or UPLOAD_PRESET) are missing. Please check your .env file and RESTART the server.');
        }
      }

      onChange([...images, ...newImageUrls]);
    } catch (error: any) {
      console.error('Failed to upload image', error);
      alert(error.message || 'Failed to upload image. Please check your Cloudinary settings.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-warm-200 group">
            <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-video rounded-xl border-2 border-dashed border-warm-300 bg-warm-50 hover:bg-warm-100 flex flex-col items-center justify-center cursor-pointer transition-colors text-warm-500",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
            ) : (
              <ImagePlus className="w-8 h-8 mb-2" />
            )}
            <span className="text-sm font-medium">
              {isUploading ? 'Uploading...' : 'Add Image'}
            </span>
            <span className="text-xs text-warm-400 mt-1">
              {images.length} / {maxImages} uploaded
            </span>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden"
      />
    </div>
  );
}