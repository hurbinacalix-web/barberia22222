import React, { useState } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { Haircut, HaircutCategory } from '../../types/barber';
import { Heart, Calendar, User, Eye, X, CheckCircle2 } from 'lucide-react';

interface GallerySectionProps {
  onSelectBarberForBooking: (barberId: string, cutTitle?: string) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectBarberForBooking }) => {
  const { haircuts, toggleLikeHaircut, barbers } = useBarberData();
  const [selectedCategory, setSelectedCategory] = useState<HaircutCategory | 'all'>('all');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('all');
  const [activeModalCut, setActiveModalCut] = useState<Haircut | null>(null);

  const categories: { id: HaircutCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos los Cortes' },
    { id: 'fade', label: 'Degradados & Fades' },
    { id: 'beard', label: 'Barba & Navaja' },
    { id: 'classic', label: 'Clásicos & Tijera' },
    { id: 'modern', label: 'Moderno & Textura' },
  ];

  const filteredHaircuts = haircuts.filter((cut) => {
    const matchCat = selectedCategory === 'all' || cut.category === selectedCategory;
    const matchBarber = selectedBarberId === 'all' || cut.barberId === selectedBarberId;
    return matchCat && matchBarber;
  });

  return (
    <section id="cortes" className="py-20 bg-neutral-900/30 text-neutral-100 border-b border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Portafolio Oficial Actualizado en Tiempo Real</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
              CORTES REALIZADOS POR NUESTROS BARBEROS
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Explora el trabajo real de nuestro equipo. Las fotografías son subidas directamente por los
              barberos desde su portal tras cada sesión de corte.
            </p>
          </div>

          <div className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-neutral-200 font-mono-num">{haircuts.length} cortes</strong> exhibidos en la colección
            </span>
          </div>
        </div>

        {/* Dual Filter Controls: Categories + Barbers */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 border-y border-neutral-800/80 py-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-900 border border-neutral-800/80 rounded-xl">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Barber Filter Select */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400">Filtrar por barbero:</span>
            <select
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">Todos los Barberos</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.nickname})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Haircuts Grid */}
        {filteredHaircuts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <p className="text-neutral-400 text-sm">
              No hay cortes disponibles en esta categoría o barbero seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHaircuts.map((cut) => (
              <div
                key={cut.id}
                className="group bg-neutral-900/80 rounded-2xl border border-neutral-800 overflow-hidden flex flex-col hover:border-neutral-700 transition-all duration-300"
              >
                {/* Image Container with Safe Ratio */}
                <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden">
                  <img
                    src={cut.imageUrl}
                    alt={cut.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Scrim for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />

                  {/* Quick Action Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeHaircut(cut.id);
                      }}
                      className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 hover:text-amber-400 border border-neutral-700/60 backdrop-blur-sm transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-mono-num"
                      title="Dar me gusta al corte"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                      <span>{cut.likes}</span>
                    </button>
                  </div>

                  {/* Barber author tag over the image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-200 font-medium bg-neutral-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-neutral-800">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{cut.barberName}</span>
                    </div>

                    <button
                      onClick={() => setActiveModalCut(cut)}
                      className="text-neutral-300 hover:text-white bg-neutral-900/80 p-1.5 rounded-md backdrop-blur-sm border border-neutral-800 transition-colors"
                      title="Ampliar corte"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
                      {cut.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                      {cut.description}
                    </p>

                    {/* Metadata clean separators without pill cages */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500 mb-4">
                      {cut.tags.map((tag, idx) => (
                        <React.Fragment key={idx}>
                          <span>#{tag}</span>
                          {idx < cut.tags.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Direct Booking CTA with this style & barber */}
                  <button
                    onClick={() => onSelectBarberForBooking(cut.barberId, cut.title)}
                    className="w-full py-2 px-3 bg-neutral-800/80 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Quiero este corte con {cut.barberName.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Fullscreen View */}
        {activeModalCut && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveModalCut(null)}
          >
            <div
              className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalCut(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white border border-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[4/3] bg-neutral-950 relative">
                <img
                  src={activeModalCut.imageUrl}
                  alt={activeModalCut.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                    Corte realizado por {activeModalCut.barberName}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono-num">
                    {activeModalCut.date}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-display">
                  {activeModalCut.title}
                </h3>

                <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
                  {activeModalCut.description}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onSelectBarberForBooking(activeModalCut.barberId, activeModalCut.title);
                      setActiveModalCut(null);
                    }}
                    className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar este corte ahora</span>
                  </button>

                  <button
                    onClick={() => toggleLikeHaircut(activeModalCut.id)}
                    className="py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl flex items-center gap-2 text-xs font-mono-num cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-current text-rose-500" />
                    <span>{activeModalCut.likes} Me gusta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
