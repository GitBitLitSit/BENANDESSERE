'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

const localeLabels: Record<Locale, string> = {
  it: 'IT',
  de: 'DE',
  en: 'EN',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="text-muted-foreground/40 mx-0.5 select-none">{'|'}</span>
          )}
          <button
            onClick={() => onLocaleChange(l)}
            className={cn(
              'px-1.5 py-0.5 text-sm font-medium rounded transition-colors',
              locale === l
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label={`Switch to ${localeLabels[l]}`}
          >
            {localeLabels[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
