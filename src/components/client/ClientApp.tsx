import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { GallerySection } from './GallerySection';
import { BookingSection } from './BookingSection';
import { AboutAndLocationSection } from './AboutAndLocationSection';
import { AppointmentTrackerModal } from './AppointmentTrackerModal';
import { Service } from '../../types/barber';

interface ClientAppProps {
  isTrackerOpen: boolean;
  setIsTrackerOpen: (open: boolean) => void;
}

export const ClientApp: React.FC<ClientAppProps> = ({ isTrackerOpen, setIsTrackerOpen }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedBarberId, setSelectedBarberId] = useState<string | undefined>();
  const [selectedCutReference, setSelectedCutReference] = useState<string | undefined>();

  const scrollToBooking = () => {
    const el = document.getElementById('agendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const el = document.getElementById('cortes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (service: Service) => {
    setSelectedServiceId(service.id);
    scrollToBooking();
  };

  const handleSelectBarberForBooking = (barberId: string, cutTitle?: string) => {
    setSelectedBarberId(barberId);
    if (cutTitle) {
      setSelectedCutReference(cutTitle);
    }
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* 1. Hero Section */}
      <HeroSection
        onBookClick={scrollToBooking}
        onGalleryClick={scrollToGallery}
      />

      {/* 2. Services and Pricing Section */}
      <ServicesSection onSelectService={handleSelectService} />

      {/* 3. Haircut Gallery Section */}
      <GallerySection onSelectBarberForBooking={handleSelectBarberForBooking} />

      {/* 4. Booking Section */}
      <BookingSection
        initialServiceId={selectedServiceId}
        initialBarberId={selectedBarberId}
        initialCutReference={selectedCutReference}
      />

      {/* 5. Barbershop Info, Location & Team */}
      <AboutAndLocationSection />

      {/* 6. Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-neutral-300 text-sm tracking-widest uppercase">
              LA HERMANDAD
            </span>
            <span>· Barber Studio & Grooming Lounge</span>
          </div>

          <p>&copy; {new Date().getFullYear()} La Hermandad Barber Studio. Todos los derechos reservados.</p>

          <button
            onClick={() => setIsTrackerOpen(true)}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
          >
            Consultar Estado de Mi Cita
          </button>
        </div>
      </footer>

      {/* Modal for checking appointments */}
      <AppointmentTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
};
