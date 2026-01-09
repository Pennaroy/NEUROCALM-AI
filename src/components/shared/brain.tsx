'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const brainImage = PlaceHolderImages['brain'];

export function Brain({ className }: { className?: string }) {
  if (!brainImage) return null;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-green-300 via-blue-400 to-violet-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute inset-8 z-0 bg-gradient-to-bl from-purple-400 via-blue-500 to-green-300 rounded-full blur-xl opacity-20 animate-pulse [animation-delay:-2s]"></div>
      <Image
        src={brainImage.imageUrl}
        alt={brainImage.description}
        width={800}
        height={800}
        data-ai-hint={brainImage.imageHint}
        className="relative z-10 opacity-70 mix-blend-screen filter saturate-150 contrast-125"
        priority
      />
      <div className="absolute inset-0 z-20 rounded-full border-2 border-white/10 shadow-[inset_0_0_20px_theme(colors.white/20%)]"></div>
    </div>
  );
}
