export interface ServiceDuration {
  minutes: number;
  price: number;
}

export interface Service {
  id: string;
  translationKey: string;
  durations: ServiceDuration[];
  icon: string;
}

export const services: Service[] = [
  {
    id: 'lotus-flow',
    translationKey: 'lotusFlow',
    durations: [
      { minutes: 50, price: 75 },
      { minutes: 80, price: 110 },
      { minutes: 110, price: 140 },
    ],
    icon: 'Flower2',
  },
  {
    id: 'classic-sports',
    translationKey: 'classic',
    durations: [
      { minutes: 50, price: 75 },
      { minutes: 80, price: 110 },
      { minutes: 110, price: 140 },
    ],
    icon: 'Dumbbell',
  },
  {
    id: 'honey-lymph',
    translationKey: 'honey',
    durations: [
      { minutes: 50, price: 75 },
      { minutes: 80, price: 110 },
      { minutes: 110, price: 140 },
    ],
    icon: 'Droplets',
  },
  {
    id: 'prana',
    translationKey: 'prana',
    durations: [{ minutes: 110, price: 140 }],
    icon: 'Sparkles',
  },
  {
    id: 'foot-reflex',
    translationKey: 'footReflex',
    durations: [{ minutes: 50, price: 75 }],
    icon: 'Footprints',
  },
];
