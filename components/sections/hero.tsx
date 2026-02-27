'use client';

import { useTranslations } from 'next-intl';
import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h1 className="font-serif text-5xl font-bold tracking-wide text-primary-foreground md:text-7xl lg:text-8xl text-balance">
          {'BEN&ESSERE'}
        </h1>
        <p className="text-lg tracking-[0.25em] text-primary-foreground/80 uppercase md:text-xl">
          {t('subtitle')}
        </p>
        <p className="mt-2 max-w-lg text-base leading-relaxed text-primary-foreground/70 md:text-lg text-pretty">
          {t('tagline')}
        </p>
        <a
          href="#booking"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
        >
          {t('cta')}
        </a>
      </div>

      {/* Scroll indicator */}
      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-primary-foreground/60"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </a>
    </section>
  );
}
