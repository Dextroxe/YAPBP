import React from 'react';
import Image from 'next/image';

interface ShapeImageProps {
  src: string;
  alt?: string;
  className?: string;
}

// Image component for displaying images inside shapes
export const ShapeImage: React.FC<ShapeImageProps> = ({
  src,
  alt = 'Shape image',
  className = ''
}) => {
  return (
    <div className={`relative w-full h-24 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
};
