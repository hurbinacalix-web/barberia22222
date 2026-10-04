import React from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import {
  Scissors,
  Calendar,
  DollarSign,
  Image,
  PlusCircle,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';

interface BarberHeaderProps {
  onOpenWalkInModal: () => void;
  onScrollToUpload: () => void;
}

export const BarberHeader: React.FC<BarberHeaderProps> = ({
  onOpenWalkInModal,
  onScrollToUpload,
}) => {
  const {
    barbers,
    activeBarberId,
    setActiveBarberId,
    appointments,
    haircuts,
    setActiveApp,
  } = useBarberData();

  const activeBarber = barbers.find((b) => b.id === activeBarberId);

  // Today's date YYYY-MM-DD
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  // Filtered metrics based on active barber or all
  const filteredAppointments = appointments.filter((a) =>
    activeBarberId === 'all' ? true : a.barberId === activeBarberId
  );

  const todayAppointments = filteredAppointments.filter((a) => a.date === todayStr);
  const pendingAppointments = filteredAppointments.filter((a) => a.status === 'pending');

  const todayEarnings = todayAppointments
    .filter((a) => a.status === 'completed' || a.status === 'confirmed' || a.status === 'in_progress')
    .reduce((sum, a) => sum + a.servicePrice, 0);

  const barberHaircutsCount = haircuts.filter((h) =>
    activeBarberId === 'all' ? true : h.barberId === activeBarberId
  ).length;

  return (
    <div className="bg-neutral-900/80 border-b border-neutral-800 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top bar with active barber selector and quick actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Scissors className="w-3.5 h-3.5" />
              <span>Portal de Gestión Profesional del Barbero</span>
              <span className="text-neutral-600">·</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono-num">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                Sincronizado con App Clientes
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              PANEL DE CONTROL & AGENDA EN VIVO
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Revisa citas agendadas por clientes, atiende en el sillón y sube fotos de cortes para el portafolio público.
            </p>
          </div>

          {/* Barber Switcher & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Barber Select */}
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
              <span className="text-xs text-neutral-400 whitespace-nowrap">Sesión actual:</span>
              <select
                value={activeBarberId}
                onChange={(e) => setActiveBarberId(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-neutral-900 text-white">
                  ★ Todos los Barberos (Vista Salón)
                </option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id} className="bg-neutral-900 text-white">
                    {b.name} ({b.nickname})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick button to register walk-in */}
            <button
              onClick={onOpenWalkInModal}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Cliente sin Cita (Walk-in)</span>
            </button>

            {/* Quick button to publish haircut */}
            <button
              onClick={onScrollToUpload}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Image className="w-4 h-4" />
              <span>Publicar Corte</span>
            </button>

            {/* View live client app */}
            <button
              onClick={() => setActiveApp('client')}
              className="px-3 py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs rounded-xl flex items-center gap-1.5 border border-neutral-800 transition-colors cursor-pointer"
              title="Ver cómo lo ven los clientes"
            >
              <span>Ver App Clientes</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Metric Cards for the Barber */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Citas para Hoy</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono-num text-white">
              {todayAppointments.length}
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              {todayAppointments.filter((a) => a.status === 'completed').length} finalizadas hoy
            </span>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Citas por Confirmar</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono-num text-amber-400">
              {pendingAppointments.length}
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              Clientes esperando confirmación
            </span>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Ingresos Proyectados Hoy</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono-num text-emerald-400">
              ${todayEarnings} <span className="text-xs font-normal text-neutral-400">USD</span>
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              De citas agendadas hoy
            </span>
          </div>

          <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Cortes en Portafolio</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono-num text-white">
              {barberHaircutsCount}
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              {activeBarber ? `De ${activeBarber.nickname}` : 'Totales en la app'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
