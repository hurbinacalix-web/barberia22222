import React, { useState } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { Appointment, AppointmentStatus } from '../../types/barber';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  CheckCircle,
  Play,
  Check,
  XCircle,
  MessageCircle,
  Filter,
  AlertTriangle,
} from 'lucide-react';

interface AppointmentsManagerProps {
  onOpenWalkInModal: () => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({ onOpenWalkInModal }) => {
  const {
    appointments,
    updateAppointmentStatus,
    cancelAppointment,
    activeBarberId,
    barbers,
  } = useBarberData();

  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'upcoming' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(
    tomorrow.getDate()
  ).padStart(2, '0')}`;

  // Filter appointments by active barber, date, and status
  const filteredAppointments = appointments.filter((apt) => {
    // Barber check
    const matchBarber = activeBarberId === 'all' || apt.barberId === activeBarberId;

    // Date check
    let matchDate = true;
    if (dateFilter === 'today') matchDate = apt.date === todayStr;
    else if (dateFilter === 'tomorrow') matchDate = apt.date === tomorrowStr;
    else if (dateFilter === 'upcoming') matchDate = apt.date >= todayStr;

    // Status check
    const matchStatus = statusFilter === 'all' || apt.status === statusFilter;

    return matchBarber && matchDate && matchStatus;
  });

  const handleOpenClientWhatsApp = (apt: Appointment) => {
    const cleanPhone = apt.clientPhone.replace(/[^0-9]/g, '');
    const message = `Hola ${apt.clientName}, te saluda ${apt.barberName} de La Hermandad Barber Studio sobre tu cita de ${apt.serviceName} para el ${apt.date} a las ${apt.time} (Código ${apt.code}).`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Pendiente de Confirmar
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Confirmada
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30 animate-pulse">
            En Sillón (Cortando)
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-800 text-neutral-400 border border-neutral-700">
            Completada
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            Cancelada
          </span>
        );
    }
  };

  return (
    <div id="citas-recibidas" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Gestor de Citas en Tiempo Real
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            CITAS AGENDADAS POR CLIENTES
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Revisa las solicitudes entrantes desde la app de clientes, confirma horarios y gestiona el flujo de trabajo en cada estación.
          </p>
        </div>

        <button
          onClick={onOpenWalkInModal}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>+ Registrar Cliente en Sala (Walk-in)</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Date Segmented Control */}
          <div className="flex flex-wrap gap-1 p-1 bg-neutral-950 border border-neutral-800/80 rounded-xl text-xs">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todas las Fechas
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setDateFilter('tomorrow')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                dateFilter === 'tomorrow'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mañana
            </button>
            <button
              onClick={() => setDateFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                dateFilter === 'upcoming'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Próximos Días
            </button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-neutral-400">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">Todos los Estados</option>
              <option value="pending">Pendientes de Confirmar</option>
              <option value="confirmed">Confirmadas</option>
              <option value="in_progress">En Sillón</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-12 text-center">
          <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-300">
            No hay citas registradas con estos filtros
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Cuando un cliente reserve desde la aplicación de clientes o registres un cliente sin cita,
            aparecerá aquí inmediatamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className={`bg-neutral-900/80 rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                apt.status === 'pending'
                  ? 'border-amber-500/50 shadow-md shadow-amber-500/5'
                  : apt.status === 'in_progress'
                  ? 'border-sky-500/50 shadow-md shadow-sky-500/5'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div>
                {/* Header: Code & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">
                      CÓDIGO DE CITA
                    </span>
                    <span className="text-sm font-black font-mono-num text-amber-400 tracking-wider">
                      {apt.code}
                    </span>
                  </div>
                  <div>{getStatusBadge(apt.status)}</div>
                </div>

                {/* Client Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white truncate">{apt.clientName}</h3>
                    <button
                      onClick={() => handleOpenClientWhatsApp(apt)}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                      title="Contactar al cliente por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5 font-mono-num">
                    <Phone className="w-3 h-3 text-neutral-500" />
                    <span>{apt.clientPhone}</span>
                  </div>
                </div>

                {/* Service & Time details */}
                <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3 mb-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-300">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Scissors className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-semibold truncate">{apt.serviceName}</span>
                    </div>
                    <span className="font-bold text-amber-400 font-mono-num ml-2 shrink-0">
                      ${apt.servicePrice} USD
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-400 text-[11px] pt-1 border-t border-neutral-800/60">
                    <div className="flex items-center gap-1 font-mono-num">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono-num text-neutral-200 font-bold">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{apt.time}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                    <span>Barbero:</span>
                    <span className="text-neutral-200 font-medium">{apt.barberName}</span>
                  </div>
                </div>

                {apt.notes && (
                  <div className="p-2.5 rounded-lg bg-neutral-950/40 border border-neutral-800/60 text-[11px] text-neutral-300 mb-4">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Nota del cliente:</span>
                    <p className="italic">{apt.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons for Barber workflow */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                {apt.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirmar Cita</span>
                    </button>
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-red-400 hover:text-red-300 text-xs rounded-xl transition-colors cursor-pointer"
                      title="Rechazar cita"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {apt.status === 'confirmed' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                    className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Llamar al Sillón (Iniciar)</span>
                  </button>
                )}

                {apt.status === 'in_progress' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                    className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Marcar Completado & Cobrado (${apt.servicePrice})</span>
                  </button>
                )}

                {apt.status === 'completed' && (
                  <div className="flex items-center justify-between text-xs text-neutral-400 py-1">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Corte Completado</span>
                    </span>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                      className="text-[11px] text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
                    >
                      Reabrir
                    </button>
                  </div>
                )}

                {apt.status === 'cancelled' && (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-red-400">Cancelada</span>
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'pending')}
                      className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      Reactivar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
