import React, { useState } from 'react';
import { BarberHeader } from './BarberHeader';
import { AppointmentsManager } from './AppointmentsManager';
import { HaircutUploader } from './HaircutUploader';
import { ServicesManager } from './ServicesManager';
import { WalkInModal } from './WalkInModal';

export const BarberApp: React.FC = () => {
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  const scrollToUpload = () => {
    const el = document.getElementById('subir-corte');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* 1. Header with active barber switcher and key daily metrics */}
      <BarberHeader
        onOpenWalkInModal={() => setIsWalkInOpen(true)}
        onScrollToUpload={scrollToUpload}
      />

      {/* 2. Real-time Appointments Management */}
      <AppointmentsManager
        onOpenWalkInModal={() => setIsWalkInOpen(true)}
      />

      {/* 3. Haircut Uploader & Portfolio Publisher */}
      <HaircutUploader />

      {/* 4. Services & Rates Manager */}
      <ServicesManager />

      {/* Walk-in Registration Modal */}
      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
      />
    </div>
  );
};
