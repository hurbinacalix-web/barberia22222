import React, { useState, useEffect } from 'react';
import { useBarberData } from '../../context/BarberDataContext';
import { Service, Barber, Appointment } from '../../types/barber';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  Phone,
  Mail,
  FileText,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface BookingSectionProps {
  initialServiceId?: string;
  initialBarberId?: string;
  initialCutReference?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  initialServiceId,
  initialBarberId,
  initialCutReference,
}) => {
  const { services, barbers, appointments, createAppointment, showToast } = useBarberData();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || services[1]?.id || services[0]?.id || ''
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    initialBarberId || 'any'
  );

  // Generate the next 8 days for booking
  const [availableDays, setAvailableDays] = useState<{ dateStr: string; label: string; weekday: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState(initialCutReference ? `Referencia de estilo: ${initialCutReference}` : '');

  // Confirmed ticket state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
  }, [initialServiceId]);

  useEffect(() => {
    if (initialBarberId) setSelectedBarberId(initialBarberId);
  }, [initialBarberId]);

  useEffect(() => {
    if (initialCutReference) {
      setNotes((prev) => (prev ? `${prev} · Ref: ${initialCutReference}` : `Referencia: ${initialCutReference}`));
    }
  }, [initialCutReference]);

  useEffect(() => {
    const days: { dateStr: string; label: string; weekday: string }[] = [];
    const today = new Date();

    const weekdayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 0; i < 9; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const weekday = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : weekdayNames[d.getDay()];
      const label = `${d.getDate()} ${monthNames[d.getMonth()]}`;

      days.push({ dateStr, label, weekday });
    }

    setAvailableDays(days);
    if (days.length > 0 && !selectedDate) {
      setSelectedDate(days[1]?.dateStr || days[0].dateStr);
    }
  }, []);

  // Standard business hours slots
  const allTimeSlots = [
    '09:30', '10:15', '11:00', '11:45', '13:00',
    '14:00', '14:45', '15:30', '16:15', '17:00',
    '17:45', '18:30', '19:15',
  ];

  // Calculate occupied slots for the selected date and barber
  const occupiedSlots = appointments
    .filter((a) => {
      const dateMatch = a.date === selectedDate;
      const statusActive = a.status !== 'cancelled';
      const barberMatch = selectedBarberId === 'any' ? false : a.barberId === selectedBarberId;
      return dateMatch && statusActive && barberMatch;
    })
    .map((a) => a.time);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Campos requeridos', 'Por favor ingresa tu nombre y número de teléfono.', 'warning');
      return;
    }

    if (!selectedTime) {
      showToast('Selecciona un horario', 'Por favor escoge la hora de tu cita.', 'warning');
      return;
    }

    // Resolve barber if "any" was selected
    let assignedBarber: Barber;
    if (selectedBarberId === 'any' || !selectedBarber) {
      // Pick barber with least appointments on that day
      assignedBarber = barbers[Math.floor(Math.random() * barbers.length)];
    } else {
      assignedBarber = selectedBarber;
    }

    const created = createAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || 'cliente@barberia.com',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      barberId: assignedBarber.id,
      barberName: assignedBarber.name,
      date: selectedDate,
      time: selectedTime,
      notes: notes.trim(),
    });

    setConfirmedAppointment(created);
  };

  const handleCopyCode = () => {
    if (!confirmedAppointment) return;
    navigator.clipboard.writeText(confirmedAppointment.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetForm = () => {
    setConfirmedAppointment(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
    setSelectedTime('');
  };

  return (
    <section id="agendar" className="py-20 bg-neutral-950 text-neutral-100 border-b border-neutral-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Reserva Fácil & Confirmación Inmediata
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            AGENDA TU CITA EN NUESTRO ESTUDIO
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Elige tu servicio, tu barbero de preferencia y la hora que mejor se adapte a tu día.
            Tu cita quedará registrada al instante y sincronizada con el portal del barbero.
          </p>
        </div>

        {confirmedAppointment ? (
          /* Confirmation Ticket Digital */
          <div className="max-w-2xl mx-auto bg-neutral-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-amber-500/10 text-neutral-100 relative overflow-hidden">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-500" />

            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                ¡CITA CONFIRMADA EXITOSAMENTE!
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Hemos enviado la notificación a tu barbero y tu espacio está reservado.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 mb-8 divide-y divide-neutral-800/80">
              {/* Code row */}
              <div className="flex items-center justify-between pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                    Código de Cita
                  </span>
                  <span className="text-2xl font-black font-mono-num text-amber-400 tracking-wider">
                    {confirmedAppointment.code}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-xs">
                <div>
                  <span className="text-neutral-500 block mb-0.5">Cliente:</span>
                  <span className="font-semibold text-neutral-200">{confirmedAppointment.clientName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Teléfono:</span>
                  <span className="font-semibold text-neutral-200 font-mono-num">{confirmedAppointment.clientPhone}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Servicio:</span>
                  <span className="font-semibold text-neutral-200">{confirmedAppointment.serviceName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Total a pagar en local:</span>
                  <span className="font-bold text-amber-400 font-mono-num text-sm">
                    ${confirmedAppointment.servicePrice} USD
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Barbero Asignado:</span>
                  <span className="font-semibold text-neutral-200">{confirmedAppointment.barberName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Fecha y Horario:</span>
                  <span className="font-semibold text-neutral-200 font-mono-num">
                    {confirmedAppointment.date} a las {confirmedAppointment.time}
                  </span>
                </div>
              </div>

              {confirmedAppointment.notes && (
                <div className="pt-4 text-xs">
                  <span className="text-neutral-500 block mb-0.5">Instrucciones o Referencia:</span>
                  <span className="text-neutral-300 italic">{confirmedAppointment.notes}</span>
                </div>
              )}
            </div>

            {/* Practical Advice */}
            <div className="bg-neutral-950/60 rounded-xl p-4 border border-neutral-800 text-xs text-neutral-400 mb-8 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Te recomendamos llegar 5 minutos antes de tu hora pactada para degustar nuestro
                café espresso de cortesía mientras preparamos tu estación. Si necesitas reprogramar,
                puedes comunicarte con el barbero vía WhatsApp o en la sección &ldquo;Consultar Mi Cita&rdquo;.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetForm}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Agendar Otra Cita
              </button>
              <a
                href="#cortes"
                className="py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition-all text-center"
              >
                Volver a la Galería
              </a>
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Step 1, 2, 3 */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Seleccionar Servicio */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span>1. Selecciona el Servicio Deseado</span>
                </div>

                <div className="space-y-2">
                  {services.map((srv) => {
                    const isSelected = srv.id === selectedServiceId;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-neutral-800/90 border-amber-500/70 text-white shadow-sm'
                            : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{srv.name}</p>
                          <p className="text-xs text-neutral-400">{srv.durationMinutes} min · {srv.category}</p>
                        </div>
                        {/* Price side by side */}
                        <div className="text-right shrink-0">
                          <span className="text-base font-black font-display text-amber-400 font-mono-num">
                            ${srv.price}
                          </span>
                          <span className="text-[10px] text-neutral-400 ml-1">USD</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Seleccionar Barbero */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>2. Elige a tu Barbero de Preferencia</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option: Any available */}
                  <div
                    onClick={() => setSelectedBarberId('any')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedBarberId === 'any'
                        ? 'bg-neutral-800/90 border-amber-500/70 text-white shadow-sm'
                        : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0 font-bold text-xs">
                      ALL
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-100">Cualquier Barbero</p>
                      <p className="text-[11px] text-neutral-400">Primer especialista libre</p>
                    </div>
                  </div>

                  {barbers.map((b) => {
                    const isSelected = b.id === selectedBarberId;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBarberId(b.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-neutral-800/90 border-amber-500/70 text-white shadow-sm'
                            : 'bg-neutral-950/70 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <img
                          src={b.avatar}
                          alt={b.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-700"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-100 truncate">{b.name}</p>
                          <p className="text-[11px] text-amber-400/90 truncate">&ldquo;{b.nickname}&rdquo;</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Seleccionar Fecha y Hora */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>3. Selecciona el Día y Horario Disponible</span>
                </div>

                {/* Day selector */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
                  {availableDays.map((d) => {
                    const isSelected = d.dateStr === selectedDate;
                    return (
                      <button
                        type="button"
                        key={d.dateStr}
                        onClick={() => {
                          setSelectedDate(d.dateStr);
                          setSelectedTime(''); // Reset time on date change
                        }}
                        className={`px-3 py-2 rounded-xl text-center shrink-0 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-[10px] uppercase block tracking-wider font-semibold">
                          {d.weekday}
                        </span>
                        <span className="text-xs font-mono-num font-bold block mt-0.5">
                          {d.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Time slot grid */}
                <div>
                  <span className="text-xs text-neutral-400 block mb-2 font-medium">
                    Horarios disponibles para {selectedDate}:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {allTimeSlots.map((time) => {
                      const isOccupied = occupiedSlots.includes(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          type="button"
                          key={time}
                          disabled={isOccupied}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-2 text-xs font-mono-num rounded-lg border text-center transition-all cursor-pointer ${
                            isOccupied
                              ? 'bg-neutral-950/40 border-neutral-900 text-neutral-600 line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-sm'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-200 hover:border-amber-400/60'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Client Data & Confirmation Summary */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 lg:sticky lg:top-28">
                <div className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>4. Tus Datos para Confirmar la Cita</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Roberto Martínez"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Teléfono / WhatsApp * (para avisos)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ej. +504 9988-7766"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono-num"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Correo Electrónico (opcional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="roberto@ejemplo.com"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Notas del Corte o Peticiones Especiales
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Degradado medio a navaja, mantener longitud arriba..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-neutral-950 border border-neutral-800/90 rounded-xl p-4 mb-6 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Servicio:</span>
                    <span className="font-semibold text-neutral-200 text-right truncate max-w-[180px]">
                      {selectedService.name}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span>Barbero:</span>
                    <span className="font-semibold text-neutral-200">
                      {selectedBarberId === 'any' ? 'Cualquiera disponible' : selectedBarber?.name}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span>Fecha & Hora:</span>
                    <span className="font-semibold text-neutral-200 font-mono-num">
                      {selectedDate} {selectedTime ? `a las ${selectedTime}` : '(Selecciona hora)'}
                    </span>
                  </div>

                  <div className="border-t border-neutral-800 pt-2 flex justify-between items-baseline">
                    <span className="font-bold text-neutral-300">Total a pagar:</span>
                    <span className="text-xl font-black font-display text-amber-400 tabular-nums">
                      ${selectedService.price} USD
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 cursor-pointer active:scale-95"
                >
                  <span>Confirmar y Agendar Cita</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-neutral-500 text-center mt-3">
                  No se requiere pago por adelantado. Pagas cómodamente en el local tras recibir tu servicio.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
