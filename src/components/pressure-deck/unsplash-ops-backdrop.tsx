'use client';

import Image from 'next/image';

const UNSPLASH_IMAGES = {
  warehouse: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80',
  controlRoom: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80',
  port: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=1920&q=80',
  nightLogistics: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80',
  conveyor: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&q=80',
} as const;

export function UnsplashOpsBackdrop({
  variant = 'warehouse',
  className,
  children,
}: {
  variant?: keyof typeof UNSPLASH_IMAGES;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <Image
        src={UNSPLASH_IMAGES[variant]}
        alt=""
        fill
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-floor-black/90 via-floor-black/80 to-floor-black/95" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
