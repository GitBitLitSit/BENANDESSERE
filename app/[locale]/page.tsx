import { HeroSection } from '@/components/sections/hero';
import { ServicesSection } from '@/components/sections/services';
import { GallerySection } from '@/components/sections/gallery';
import { BookingSection } from '@/components/sections/booking';
import { ContactSection } from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <BookingSection />
      <ContactSection />
    </>
  );
}
