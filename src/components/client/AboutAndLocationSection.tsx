import React from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { BARBERSHOP_INFO } from '../../data/initialData';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Coffee,
  Star,
  Car,
  Award,
  Navigation,
  ExternalLink,
} from 'lucide-react';

export const AboutAndLocationSection: React.FC = () => {
  const { barbers, reviews } = useBarberData();

  const handleOpenMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        'Plaza Los Almendros Bulevar Morazan Tegucigalpa'
      )}`,
      '_blank'
    );
  };

  const handleOpenWhatsApp = () => {
    window.open(
      `https://wa.me/50498765432?text=${encodeURIComponent(
        '¡Hola La Hermandad Barber! Quisiera información sobre sus servicios y disponibilidad.'
      )}`,
      '_blank'
    );
  };

  return (
    <section id="ubicacion" className="py-20 bg-neutral-950 text-neutral-100 border-b border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            La Experiencia La Hermandad
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            NUESTRO ESTUDIO, EQUIPO Y UBICACIÓN
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Conoce el espacio diseñado para tu comodidad, nuestro equipo de maestros barberos y la
            ubicación exacta con estacionamiento privado.
          </p>
        </div>

        {/* 1. Barbershop Atmosphere & Values (Why Choose Us) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Higiene Grado Quirúrgico
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Esterilizamos cada tijera y peine con cabina de rayos UV. Las navajas son estrictamente
              desechables y se abren frente a ti en cada sesión.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Bar de Cortesía Exclusivo
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Disfruta un café espresso recién molido o una cerveza fría mientras esperas o durante
              tu ritual de toalla caliente aromatizada.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Maestros Barberos Certificados
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Nuestro equipo acumula más de 25 años de experiencia combinada en técnicas internacionales
              de visagismo masculino y navaja clásica.
            </p>
          </div>
        </div>

        {/* 2. Meet the Barbers */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                Talento de Primera Clase
              </span>
              <h3 className="text-2xl font-bold font-display text-white">
                CONOCE A NUESTROS BARBEROS
              </h3>
            </div>
            <span className="text-xs text-neutral-400">
              Especialistas dedicados a perfeccionar tu imagen
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-white truncate">{barber.name}</h4>
                      <p className="text-xs text-amber-400 font-medium">{barber.nickname}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-400 mt-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono-num font-bold text-neutral-200">{barber.rating}</span>
                        <span className="text-neutral-500 font-mono-num">({barber.cutsCount}+ cortes)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    {barber.bio}
                  </p>

                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                      Especialidades:
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-neutral-300">
                      {barber.specialties.map((s, i) => (
                        <span key={i} className="bg-neutral-800/80 px-2 py-0.5 rounded text-neutral-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span>{barber.experience}</span>
                  <span className="text-amber-400/90 font-medium">{barber.instagram}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Location, Interactive Mock Map, Schedule & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Left: Location & Hours details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>UBICACIÓN & REFERENCIAS</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-300 mb-6">
                <div>
                  <span className="text-neutral-500 text-xs block mb-0.5 uppercase tracking-wider font-semibold">
                    Dirección Física:
                  </span>
                  <p className="text-base font-semibold text-white">
                    {BARBERSHOP_INFO.address}
                  </p>
                </div>

                <div>
                  <span className="text-neutral-500 text-xs block mb-0.5 uppercase tracking-wider font-semibold">
                    Punto de Referencia:
                  </span>
                  <p className="text-neutral-300">
                    {BARBERSHOP_INFO.reference}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-neutral-300 pt-2">
                  <Car className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Estacionamiento seguro en plaza con guardia privado 24/7.</span>
                </div>
              </div>

              {/* Action buttons for location */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleOpenMaps}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Abrir en Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </button>

                <button
                  onClick={handleOpenWhatsApp}
                  className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Barbería</span>
                </button>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>HORARIOS DE ATENCIÓN</span>
              </h3>

              <div className="space-y-3">
                {BARBERSHOP_INFO.schedule.map((sch, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-neutral-800/80 text-xs sm:text-sm"
                  >
                    <span className="text-neutral-300 font-medium">{sch.days}</span>
                    <span className="font-bold text-amber-400 font-mono-num">{sch.hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Recepción telefónica: <strong className="text-neutral-200">{BARBERSHOP_INFO.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Stylized interactive map representation */}
          <div className="lg:col-span-6 bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                  Mapa Interactivo del Local
                </span>
                <span className="text-xs text-emerald-400 font-mono-num flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Local Abierto Ahora
                </span>
              </div>

              {/* Graphical Map Representation */}
              <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 aspect-[16/10] p-4 flex flex-col items-center justify-center text-center">
                {/* Visual grid lines simulating streets */}
                <div className="absolute inset-0 opacity-15">
                  <div className="w-full h-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                {/* Major Boulevard graphic */}
                <div className="absolute w-full h-10 bg-neutral-800/60 top-1/2 -translate-y-1/2 transform -rotate-6 flex items-center justify-center">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono-num">
                    Bulevar Morazán · Arteria Principal
                  </span>
                </div>

                {/* Interactive Map Pin */}
                <div className="relative z-10 flex flex-col items-center group cursor-pointer" onClick={handleOpenMaps}>
                  <div className="p-3 bg-amber-500 text-neutral-950 rounded-2xl shadow-xl shadow-amber-500/30 transform group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="mt-3 px-3 py-1.5 bg-neutral-900/90 border border-amber-500/50 rounded-lg shadow-lg">
                    <p className="text-xs font-bold text-white whitespace-nowrap">La Hermandad Barber Studio</p>
                    <p className="text-[10px] text-amber-400">Plaza Los Almendros, Local 4</p>
                  </div>
                </div>

                {/* Coordinates watermark */}
                <div className="absolute bottom-2 right-2 text-[10px] font-mono-num text-neutral-600">
                  14°05&apos;42.1&quot;N 87°11&apos;18.4&quot;W
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400 text-center sm:text-left">
                <p className="font-semibold text-neutral-200">¿Vienes en vehículo propio?</p>
                <p>Contamos con más de 25 estacionamientos rotativos para clientes.</p>
              </div>
              <button
                onClick={handleOpenMaps}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Cómo Llegar</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Customer Reviews & Social Proof */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
              Opiniones de Clientes Satisfechos
            </span>
            <h3 className="text-2xl font-bold font-display text-white">
              LO QUE DICEN DE NUESTRO SERVICIO
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-200 block">{rev.clientName}</span>
                    <span className="text-neutral-500 text-[11px]">Atendido por {rev.barberName}</span>
                  </div>
                  <span className="text-neutral-500 text-[11px]">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
