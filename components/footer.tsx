'use client';

import { useTranslations } from 'next-intl';
import { Instagram } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-2xl font-bold text-foreground">
            {'BEN&ESSERE'}
          </span>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {t('tagline')}
          </p>
        </div>

        <a
          href="https://www.instagram.com/larissa_benessere"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-primary"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{`${year} BEN&ESSERE. ${t('rights')}`}</span>
          <span className="text-border">{'|'}</span>
          <a href="#" className="hover:text-foreground transition-colors">{t('privacy')}</a>
          <span className="text-border">{'|'}</span>
          <a href="#" className="hover:text-foreground transition-colors">{t('imprint')}</a>
        </div>
      </div>
    </footer>
  );
}
