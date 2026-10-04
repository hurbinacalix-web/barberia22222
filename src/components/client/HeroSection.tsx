import React from 'react';
import { BARBERSHOP_INFO } from '../../data/initialData';
import { Calendar, Eye, Sparkles, MapPin, Clock } from 'lucide-react';

interface HeroSectionProps {
  onBookClick: () => void;
  onGalleryClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookClick, onGalleryClick }) => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800">
      {/* Background with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={BARBERSHOP_INFO.heroImage}
          alt="Interior de La Hermandad Barber Studio"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 filter saturate-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl">
          {/* Subtle kicker without pill badge */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Maestría Clásica & Estilo Contemporáneo</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400">Est. 2018</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-none mb-6">
            EL ARTE DEL CORTE Y LA NAVAJA PERFECTA
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-2xl font-normal">
            Una experiencia de cuidado masculino sin prisas. Degradados milimétricos,
            esculpido de barba con toalla caliente aromatizada al vapor de eucalipto
            y café de cortesía mientras te relajas en nuestras sillas clásicas.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onBookClick}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl flex items-center gap-2.5 transition-all shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Cita en Línea</span>
            </button>

            <button
              onClick={onGalleryClick}
              className="px-6 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 hover:border-neutral-500 font-semibold text-sm rounded-xl flex items-center gap-2.5 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Ver Cortes Recientes</span>
            </button>
          </div>

          {/* Quick info row with clean typography */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-neutral-400 border-t border-neutral-800/80 pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{BARBERSHOP_INFO.address}</span>
            </div>
            <span aria-hidden="true" className="hidden sm:inline text-neutral-700">·</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Lunes a Sábado: 9:00 AM – 8:30 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities highlight strip */}
      <div className="relative z-10 bg-neutral-900/60 border-t border-neutral-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BARBERSHOP_INFO.amenities.map((amenity, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-xs font-bold text-amber-400 tracking-wide uppercase">
                  {amenity.title}
                </span>
                <span className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                  {amenity.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
