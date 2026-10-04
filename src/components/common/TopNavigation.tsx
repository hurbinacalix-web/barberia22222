import React from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { Scissors, UserCheck, Calendar } from 'lucide-react';

interface TopNavProps {
  onOpenTracker?: () => void;
}

export const TopNavigation: React.FC<TopNavProps> = ({ onOpenTracker }) => {
  const { activeApp, setActiveApp, appointments } = useBarberData();

  // Pending appointments count for barber portal notification badge
  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl sm:text-2xl font-black tracking-widest font-display text-neutral-100 hover:text-amber-400 transition-colors uppercase whitespace-nowrap"
        >
          LA HERMANDAD
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide">
          {activeApp === 'client' ? (
            <>
              <a
                href="#servicios"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Servicios & Precios
              </a>
              <a
                href="#cortes"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Galería de Cortes
              </a>
              <a
                href="#agendar"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Agendar Cita
              </a>
              <a
                href="#ubicacion"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Ubicación & Horarios
              </a>
              {onOpenTracker && (
                <button
                  onClick={onOpenTracker}
                  className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-sm font-medium"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Consultar Mi Cita</span>
                </button>
              )}
            </>
          ) : (
            <>
              <a
                href="#citas-recibidas"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Agenda de Citas ({appointments.length})
              </a>
              <a
                href="#subir-corte"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Publicar Nuevo Corte
              </a>
              <a
                href="#tarifas-servicios"
                className="text-neutral-400 hover:text-neutral-100 transition-colors hover:underline underline-offset-8"
              >
                Ajustar Precios
              </a>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions (Portal Switcher with live status) */}
        <div className="flex items-center gap-2">
          {/* Segmented app switch control */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setActiveApp('client')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeApp === 'client'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>App Clientes</span>
            </button>

            <button
              onClick={() => setActiveApp('barber')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap relative cursor-pointer ${
                activeApp === 'barber'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Portal Barberos</span>
              {pendingAppointments > 0 && (
                <span
                  title={`${pendingAppointments} citas pendientes`}
                  className="px-1.5 py-0.2 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse font-mono-num"
                >
                  {pendingAppointments}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
