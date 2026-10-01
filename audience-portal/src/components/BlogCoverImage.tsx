"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function BlogCoverImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  if (error || !src) return null;

  return (
    <div className={`relative overflow-hidden bg-zinc-900 shadow-2xl ${className || 'w-full aspect-[21/9] md:aspect-[2.5/1] lg:aspect-[3/1] rounded-2xl md:rounded-3xl'}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
        onError={() => setError(true)}
      />
    </div>
  );
}
