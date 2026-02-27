'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Instagram } from 'lucide-react';

const FALLBACK_IMAGES = [
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&h=600&fit=crop',
];

interface GalleryImage {
  url: string;
  link?: string;
}

export function GallerySection() {
  const t = useTranslations('gallery');
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/instagram');
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images);
            return;
          }
        }
      } catch {
        // fallback
      }
      setImages(FALLBACK_IMAGES.map((url) => ({ url })));
    }
    fetchImages();
  }, []);

  return (
    <section id="gallery" className="scroll-mt-20 bg-secondary/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {t('subtitle')}
          </p>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {images.map((img, idx) => (
            <a
              key={idx}
              href={img.link || 'https://www.instagram.com/larissa_benessere'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={img.url}
                alt={`Gallery image ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20">
                <Instagram
                  size={28}
                  className="text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100"
                />
              </div>
            </a>
          ))}
        </div>

        {/* Instagram link */}
        <div className="mt-8 text-center">
          <a
            href="https://www.instagram.com/larissa_benessere"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Instagram size={16} />
            {t('followUs')}
          </a>
        </div>
      </div>
    </section>
  );
}
