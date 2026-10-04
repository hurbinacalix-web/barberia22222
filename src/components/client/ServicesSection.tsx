import React, { useState } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { Service, ServiceCategory } from '../../types/barber';
import { Clock, Check, Scissors, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { services } = useBarberData();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');

  const categories: { id: ServiceCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todos los Servicios' },
    { id: 'hair', label: 'Cortes de Cabello' },
    { id: 'beard', label: 'Barba & Afeitado' },
    { id: 'combo', label: 'Combos VIP' },
    { id: 'spa', label: 'Facial & Spa' },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  return (
    <section id="servicios" className="py-20 bg-neutral-950 text-neutral-100 border-b border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              Carta Oficial de Servicios & Precios
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
              SERVICIOS DE BARBERÍA Y CABALLERO
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Cada servicio incluye diagnóstico capilar o facial, productos de barbería de primera línea
              y asesoría en el mantenimiento diario de tu estilo.
            </p>
          </div>

          {/* Category Filter segmented control */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services List with prices side-by-side (a la par) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-6 rounded-2xl bg-neutral-900/70 border transition-all duration-200 flex flex-col justify-between hover:bg-neutral-900 ${
                service.isPopular
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 relative overflow-hidden'
                  : 'border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              {service.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-amber-500 text-neutral-950 text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-bl-lg tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Más Solicitado</span>
                  </div>
                </div>
              )}

              <div>
                {/* Title and price directly side-by-side */}
                <div className="flex items-start justify-between gap-4 border-b border-neutral-800/80 pb-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{service.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{service.durationMinutes} minutos aprox.</span>
                    </div>
                  </div>

                  {/* PRICE PROMINENTLY SIDE BY SIDE */}
                  <div className="text-right shrink-0">
                    <span className="text-2xl sm:text-3xl font-black font-display text-amber-400 tabular-nums">
                      ${service.price}
                    </span>
                    <span className="text-[11px] block text-neutral-400 font-medium">USD</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Included features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-6 text-xs text-neutral-400">
                  {service.included.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400/90 shrink-0" />
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectService(service)}
                className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span>Agendar este servicio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Pricing assurance note */}
        <div className="mt-8 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            * Todos los precios incluyen impuestos locales y bebida artesanal o café de la casa.
            Aceptamos efectivo, tarjetas de débito/crédito y transferencias bancarias.
          </p>
          <a
            href="#agendar"
            className="text-amber-400 hover:text-amber-300 font-semibold whitespace-nowrap"
          >
            Ir al formulario de reserva &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};
