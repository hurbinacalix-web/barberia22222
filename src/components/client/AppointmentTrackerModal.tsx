import React, { useState } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { X, Search, Calendar, User, Phone, Scissors, AlertCircle } from 'lucide-react';
import { AppointmentStatus } from '../../types/barber';

interface AppointmentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentTrackerModal: React.FC<AppointmentTrackerModalProps> = ({ isOpen, onClose }) => {
  const { appointments, cancelAppointment } = useBarberData();
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const normalized = searchTerm.trim().toLowerCase();

  const results = appointments.filter((apt) => {
    if (!normalized) return false;
    return (
      apt.code.toLowerCase().includes(normalized) ||
      apt.clientPhone.toLowerCase().includes(normalized) ||
      apt.clientName.toLowerCase().includes(normalized)
    );
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return <span className="text-amber-400 font-semibold">Pendiente de confirmación</span>;
      case 'confirmed':
        return <span className="text-emerald-400 font-semibold">Confirmada por el barbero</span>;
      case 'in_progress':
        return <span className="text-sky-400 font-semibold">En Silla / Siendo atendido</span>;
      case 'completed':
        return <span className="text-neutral-400 font-semibold">Completada</span>;
      case 'cancelled':
        return <span className="text-red-400 font-semibold">Cancelada</span>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            Portal de Autoservicio del Cliente
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            CONSULTAR ESTADO DE MI CITA
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Ingresa tu código de confirmación (ej. LH-4921) o tu número de teléfono celular.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
          className="flex gap-2 mb-6"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ingresa código LH-XXXX o teléfono..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono-num"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </form>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto space-y-3">
          {searched && results.length === 0 && (
            <div className="p-6 text-center bg-neutral-950 rounded-xl border border-neutral-800/80">
              <AlertCircle className="w-6 h-6 text-neutral-500 mx-auto mb-2" />
              <p className="text-xs text-neutral-300 font-medium">No se encontró ninguna cita con ese dato.</p>
              <p className="text-[11px] text-neutral-500 mt-1">Verifica el código de cita o el número de teléfono registrado.</p>
            </div>
          )}

          {results.map((apt) => (
            <div
              key={apt.id}
              className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Código</span>
                  <span className="font-bold text-amber-400 font-mono-num text-sm">{apt.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Estado actual</span>
                  <div>{getStatusBadge(apt.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="truncate">{apt.clientName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono-num">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{apt.clientPhone}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-neutral-200">{apt.serviceName} (${apt.servicePrice} USD)</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 font-mono-num text-neutral-400">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{apt.date} a las {apt.time} · Barbero: {apt.barberName}</span>
                </div>
              </div>

              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                <div className="pt-2 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => cancelAppointment(apt.id)}
                    className="text-[11px] text-red-400 hover:text-red-300 font-medium cursor-pointer"
                  >
                    Cancelar esta cita
                  </button>
                </div>
              )}
            </div>
          ))}

          {!searched && (
            <div className="text-center py-6 text-neutral-500 text-xs">
              Escribe tu código de cita o teléfono arriba y presiona &ldquo;Buscar&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
