'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import { services, type Service, type ServiceDuration } from '@/lib/services';
import { cn } from '@/lib/utils';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flower2,
  Dumbbell,
  Droplets,
  Sparkles,
  Footprints,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { it, de, enUS } from 'date-fns/locale';

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Flower2,
  Dumbbell,
  Droplets,
  Sparkles,
  Footprints,
};

const dateLocales: Record<string, typeof enUS> = { it, de, en: enUS };

const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'] as const;

// Generate time slots client-side for static hosting (when /api/availability is unavailable)
const WORK_START = 9;
const WORK_END = 18;
const SLOT_INTERVAL = 30;

function generateStaticSlots(durationMinutes: number): string[] {
  const slots: string[] = [];
  for (let hour = WORK_START; hour < WORK_END; hour++) {
    for (let min = 0; min < 60; min += SLOT_INTERVAL) {
      const endMinutes = hour * 60 + min + durationMinutes;
      if (endMinutes <= WORK_END * 60) {
        slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
  }
  return slots;
}

export function BookingSection() {
  const t = useTranslations('booking');
  const ts = useTranslations('services');
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<ServiceDuration | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate || !selectedDuration) return;
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedTime(null);

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const basePath = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : '';
    fetch(`${basePath}/api/availability?date=${dateStr}&duration=${selectedDuration.minutes}`)
      .then((res) => {
        if (res.ok) return res.json().then((data) => data.slots || []);
        return [];
      })
      .then((slots) => {
        setAvailableSlots(Array.isArray(slots) && slots.length > 0 ? slots : generateStaticSlots(selectedDuration.minutes));
      })
      .catch(() => {
        setAvailableSlots(generateStaticSlots(selectedDuration.minutes));
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedDuration]);

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedService;
      case 1: return !!selectedDuration;
      case 2: return !!selectedDate;
      case 3: return !!selectedTime;
      case 4: return formData.name.trim() !== '' && formData.email.includes('@') && formData.phone.trim() !== '';
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    const basePath = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : '';
    try {
      const res = await fetch(`${basePath}/api/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
          service: selectedService?.id,
          serviceName: ts(`${selectedService?.translationKey as 'lotusFlow'}.name`),
          duration: selectedDuration?.minutes,
          price: selectedDuration?.price,
          date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          time: selectedTime,
          locale,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(t('error'));
      }
    } catch {
      setError(t('error'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setStep(0);
    setSelectedService(null);
    setSelectedDuration(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setFormData({ name: '', email: '', phone: '', notes: '' });
    setSuccess(false);
    setError('');
  };

  if (success) {
    return (
      <section id="booking" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Check size={40} className="text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground">{t('success')}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t('successMessage')}</p>
          <button
            onClick={resetBooking}
            className="mt-8 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t('bookAnother')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-4xl px-6">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
            {t('subtitle')}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => { if (i < step) setStep(i); }}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                  i < step && 'bg-primary text-primary-foreground cursor-pointer',
                  i === step && 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
                  i > step && 'bg-secondary text-muted-foreground',
                )}
                disabled={i >= step}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'mx-1 h-0.5 w-6 rounded-full md:w-10',
                  i < step ? 'bg-primary' : 'bg-border',
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step label */}
        <h3 className="mb-6 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {t(STEPS[step])}
        </h3>

        {/* Step 1: Select service */}
        {step === 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              const sKey = service.translationKey as 'lotusFlow';
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    if (service.durations.length === 1) {
                      setSelectedDuration(service.durations[0]);
                    } else {
                      setSelectedDuration(null);
                    }
                  }}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border p-5 text-left transition-all',
                    selectedService?.id === service.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/40',
                  )}
                >
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    selectedService?.id === service.id ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground',
                  )}>
                    {Icon && <Icon size={20} />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-serif text-sm font-semibold text-foreground">{ts(`${sKey}.name`)}</span>
                    {ts(`${sKey}.detail`) && (
                      <span className="text-xs text-primary/70">{ts(`${sKey}.detail`)}</span>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {service.durations.map((d) => (
                        <span key={d.minutes} className="text-xs text-muted-foreground">
                          {d.minutes} {ts('minutes')} / {d.price}{'€'}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Select duration */}
        {step === 1 && selectedService && (
          <div className="mx-auto flex max-w-md flex-col gap-3">
            {selectedService.durations.map((dur) => (
              <button
                key={dur.minutes}
                onClick={() => setSelectedDuration(dur)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-5 transition-all',
                  selectedDuration?.minutes === dur.minutes
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/40',
                )}
              >
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{dur.minutes} {ts('minutes')}</span>
                </div>
                <span className="text-lg font-bold text-primary">{dur.price}{'€'}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Select date */}
        {step === 2 && (
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={dateLocales[locale] || enUS}
              disabled={{ before: new Date() }}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            />
          </div>
        )}

        {/* Step 4: Select time */}
        {step === 3 && (
          <div className="mx-auto max-w-md">
            {loadingSlots ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">{t('loading')}</span>
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">{t('noSlots')}</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      'rounded-lg border px-4 py-3 text-sm font-medium transition-all',
                      selectedTime === slot
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/40',
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Contact info */}
        {step === 4 && (
          <div className="mx-auto flex max-w-md flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('name')} *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('email')} *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('phone')} *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('notes')}</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={t('notesPlaceholder')}
                rows={3}
                className="rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 6: Summary */}
        {step === 5 && (
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
            <h4 className="mb-4 font-serif text-lg font-semibold text-foreground">{t('summary')}</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: t('service'), value: ts(`${selectedService?.translationKey as 'lotusFlow'}.name`) },
                { label: t('duration'), value: `${selectedDuration?.minutes} ${ts('minutes')}` },
                { label: t('date'), value: selectedDate ? format(selectedDate, 'PPP', { locale: dateLocales[locale] || enUS }) : '' },
                { label: t('time'), value: selectedTime || '' },
                { label: t('price'), value: `${selectedDuration?.price}€` },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm text-muted-foreground">{t('name')}</span>
                <span className="text-sm font-medium text-foreground">{formData.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('email')}</span>
                <span className="text-sm font-medium text-foreground">{formData.email}</span>
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-10 flex items-center justify-center gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ChevronLeft size={16} />
              {t('back')}
            </button>
          )}
          {step < 5 && (
            <button
              onClick={() => {
                if (step === 0 && selectedService && selectedService.durations.length === 1) {
                  setSelectedDuration(selectedService.durations[0]);
                  setStep(2); // Skip duration step
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={!canProceed()}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all',
                canProceed()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-secondary text-muted-foreground cursor-not-allowed',
              )}
            >
              {t('next')}
              <ChevronRight size={16} />
            </button>
          )}
          {step === 5 && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {t('confirm')}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
