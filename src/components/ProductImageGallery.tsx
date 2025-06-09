import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils"; // For conditional classes

interface ImageObject {
  src: string;
  alt: string;
  id: string | number;
}

interface ProductImageGalleryProps {
  images: ImageObject[];
  mainImageRatio?: number;
  thumbnailSize?: string; // Tailwind class e.g. "w-16 h-16"
  initialImageId?: string | number;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  mainImageRatio = 1, // Default to square
  thumbnailSize = 'w-20 h-20',
  initialImageId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (initialImageId && images.length > 0) {
      const initialIndex = images.findIndex(img => img.id === initialImageId);
      if (initialIndex !== -1) {
        setCurrentIndex(initialIndex);
      }
    } else if (images.length > 0) {
      setCurrentIndex(0);
    }
  }, [initialImageId, images]);

  console.log("Rendering ProductImageGallery, current index:", currentIndex, "Total images:", images.length);

  if (!images || images.length === 0) {
    return (
      <div className={cn("w-full bg-muted flex items-center justify-center rounded", `aspect-[${mainImageRatio}/1]`)}>
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const handleThumbnailClick = (index: number) => {
    console.log("Thumbnail clicked, setting main image to index:", index);
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full overflow-hidden rounded-lg border">
        <AspectRatio ratio={mainImageRatio} className="bg-muted">
          {currentImage ? (
            <img
              src={currentImage.src || '/placeholder.svg'}
              alt={currentImage.alt || 'Main product image'}
              className="object-contain w-full h-full" // object-contain to see full image
              onError={(e) => { e.currentTarget.src = '/placeholder.svg'; console.error("Error loading main image:", currentImage.src); }}
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground">Image loading...</div>
          )}
        </AspectRatio>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                index === currentIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50',
                thumbnailSize,
                "flex-shrink-0" // Important for horizontal scrolling
              )}
              aria-label={`View image ${index + 1} of ${images.length}, ${image.alt}`}
            >
              <img
                src={image.src || '/placeholder.svg'}
                alt={image.alt || `Thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
                onError={(e) => { e.currentTarget.src = '/placeholder.svg'; console.warn("Error loading thumbnail:", image.src);}}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;