'use client';

import { useTranslations } from 'next-intl';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

export function ContactSection() {
  const t = useTranslations('contact');

  const contactItems = [
    { icon: MapPin, label: t('address'), value: 'BEN&ESSERE Studio' },
    { icon: Phone, label: t('phone'), value: '+39 XXX XXX XXXX' },
    { icon: Mail, label: t('email'), value: 'info@benessere.com' },
    { icon: Clock, label: t('hours'), value: t('hoursValue') },
  ];

  return (
    <section id="contact" className="scroll-mt-20 bg-secondary/30 py-24">
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

        {/* Contact grid */}
        <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
          {contactItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social link */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">{t('followUs')}</p>
          <a
            href="https://www.instagram.com/larissa_benessere"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:shadow-sm"
          >
            <Instagram size={16} className="text-primary" />
            @larissa_benessere
          </a>
        </div>
      </div>
    </section>
  );
}
