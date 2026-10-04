import React, { useState } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { X, UserPlus, Scissors, Clock } from 'lucide-react';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({ isOpen, onClose }) => {
  const { services, barbers, activeBarberId, createAppointment } = useBarberData();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [barberId, setBarberId] = useState(
    activeBarberId !== 'all' ? activeBarberId : barbers[0]?.id || ''
  );
  const [notes, setNotes] = useState('Cliente en sala (Walk-in)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const selectedService = services.find((s) => s.id === serviceId) || services[0];
    const selectedBarber = barbers.find((b) => b.id === barberId) || barbers[0];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    createAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || 'Presencial en sala',
      clientEmail: 'walkin@barberia.com',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      date: todayStr,
      time: timeStr,
      notes: notes.trim(),
    });

    onClose();
    setClientName('');
    setClientPhone('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <UserPlus className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Atención Inmediata</span>
        </div>

        <h3 className="text-xl font-bold font-display text-white mb-2">
          REGISTRAR CLIENTE SIN CITA (WALK-IN)
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Agrega al cliente presente en la sala para que el turno quede bloqueado y se contabilice en los ingresos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Nombre del Cliente *</label>
            <input
              type="text"
              required
              autoFocus
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ej. David Aguilar"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Teléfono (opcional)</label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Ej. +504 9922-3344"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono-num"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Servicio a Realizar *</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - ${s.price} USD ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Barbero que Atiende *</label>
            <select
              value={barberId}
              onChange={(e) => setBarberId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-neutral-100 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.nickname})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1.5">Notas rápidas</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-colors cursor-pointer"
            >
              Ingresar al Sillón Ahora
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
