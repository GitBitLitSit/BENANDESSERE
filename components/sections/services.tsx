'use client';

import { useTranslations } from 'next-intl';
import { services } from '@/lib/services';
import { Flower2, Dumbbell, Droplets, Sparkles, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Flower2,
  Dumbbell,
  Droplets,
  Sparkles,
  Footprints,
};

export function ServicesSection() {
  const t = useTranslations('services');

  return (
    <section id="services" className="scroll-mt-20 py-24">
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

        {/* Services grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon];
            const sKey = service.translationKey as 'lotusFlow' | 'classic' | 'honey' | 'prana' | 'footReflex';
            return (
              <div
                key={service.id}
                className={cn(
                  'group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1',
                  idx === 3 && 'lg:col-start-1 lg:col-end-2',
                  idx === 4 && 'lg:col-start-2 lg:col-end-3',
                )}
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                  {Icon && <Icon size={24} />}
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {t(`${sKey}.name`)}
                  </h3>
                  {t(`${sKey}.detail`) && (
                    <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">
                      {t(`${sKey}.detail`)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`${sKey}.description`)}
                </p>

                {/* Price pills */}
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {service.durations.map((dur) => (
                    <span
                      key={dur.minutes}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                    >
                      <span>{dur.minutes} {t('minutes')}</span>
                      <span className="text-primary font-semibold">{dur.price}{'€'}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
