'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HeroImageProps {
  className?: string;
}

export function HeroImage({ className = '' }: HeroImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    // Fallback design when image fails to load
    return (
      <div className={`relative rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-green-50 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative z-10 p-8 text-center">
          <div className="text-6xl font-bold text-primary mb-4">Shalean</div>
          <p className="text-muted-foreground mb-4">Professional Cleaning Team</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold">4.9/5</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Trusted by families across South Africa</p>
        </div>
        <Badge className="absolute top-4 right-4 bg-green-500 text-white">
          Professional Team
        </Badge>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      <Image
        src="/images/cleaning-team-hero.jpg"
        alt="Professional Shalean Cleaning Services team working in a modern kitchen"
        width={600}
        height={400}
        className="w-full h-auto object-cover"
        priority
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <Badge className="absolute top-4 right-4 bg-green-500 text-white">
        Professional Team
      </Badge>
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold">4.9/5</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        <p className="text-sm opacity-90">Trusted by families across South Africa</p>
      </div>
    </div>
  );
}

