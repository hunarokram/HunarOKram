import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

/**
 * Compresses an image file in the browser before uploading.
 * Default settings compress to ~1MB and max 1920px dimensions.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 1, // Compress to max 1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true, // Use background thread so UI doesn't freeze
    fileType: 'image/webp', // Convert to WebP for best compression
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    const compressedBlob = await imageCompression(file, compressionOptions);
    // Convert Blob back to File to maintain filename
    return new File([compressedBlob], file.name.replace(/\.[^/.]+$/, '') + '.webp', {
      type: 'image/webp',
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    // Fallback to original file if compression fails for any reason
    return file;
  }
}
