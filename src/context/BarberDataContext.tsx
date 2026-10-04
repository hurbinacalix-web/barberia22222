import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Haircut,
  Service,
  Barber,
  Appointment,
  Review,
  AppointmentStatus,
} from '../types/barber';
import {
  INITIAL_BARBERS,
  INITIAL_SERVICES,
  INITIAL_HAIRCUTS,
  INITIAL_APPOINTMENTS,
  INITIAL_REVIEWS,
} from '../data/initialData';

interface ToastNotice {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface BarberContextType {
  haircuts: Haircut[];
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  reviews: Review[];
  activeBarberId: string;
  setActiveBarberId: (id: string) => void;
  activeApp: 'client' | 'barber';
  setActiveApp: (app: 'client' | 'barber') => void;
  // Haircut actions
  addHaircut: (haircut: Omit<Haircut, 'id' | 'likes'>) => Haircut;
  deleteHaircut: (id: string) => void;
  toggleLikeHaircut: (id: string) => void;
  // Appointment actions
  createAppointment: (appointment: Omit<Appointment, 'id' | 'code' | 'createdAt' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  cancelAppointment: (id: string) => void;
  // Service actions
  updateServicePrice: (id: string, newPrice: number) => void;
  addService: (service: Omit<Service, 'id'>) => Service;
  // Feedback notifications
  toasts: ToastNotice[];
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const STORAGE_KEY = 'hermandad_barber_hub_v2';

const BarberContext = createContext<BarberContextType | undefined>(undefined);

export const BarberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [haircuts, setHaircuts] = useState<Haircut[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_haircuts`);
      return saved ? JSON.parse(saved) : INITIAL_HAIRCUTS;
    } catch {
      return INITIAL_HAIRCUTS;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [barbers] = useState<Barber[]>(INITIAL_BARBERS);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_appointments`);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [reviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeBarberId, setActiveBarberId] = useState<string>('barber-1');
  const [activeApp, setActiveApp] = useState<'client' | 'barber'>('client');
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_haircuts`, JSON.stringify(haircuts));
    } catch (e) {
      console.warn('LocalStorage save haircut error', e);
    }
  }, [haircuts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
    } catch (e) {
      console.warn('LocalStorage save service error', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage save appointment error', e);
    }
  }, [appointments]);

  // Cross-tab sync using storage listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${STORAGE_KEY}_haircuts` && e.newValue) {
        setHaircuts(JSON.parse(e.newValue));
      }
      if (e.key === `${STORAGE_KEY}_appointments` && e.newValue) {
        setAppointments(JSON.parse(e.newValue));
      }
      if (e.key === `${STORAGE_KEY}_services` && e.newValue) {
        setServices(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const newToast: ToastNotice = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add a new haircut from barber portal -> immediately appears in client gallery
  const addHaircut = (haircutData: Omit<Haircut, 'id' | 'likes'>): Haircut => {
    const newHaircut: Haircut = {
      ...haircutData,
      id: `cut-${Date.now()}`,
      likes: 0,
    };

    setHaircuts((prev) => [newHaircut, ...prev]);
    showToast(
      '¡Corte publicado con éxito!',
      `"${newHaircut.title}" ya está visible para todos los clientes en la galería.`,
      'success'
    );
    return newHaircut;
  };

  const deleteHaircut = (id: string) => {
    setHaircuts((prev) => prev.filter((c) => c.id !== id));
    showToast('Corte eliminado', 'Se ha retirado de la galería de clientes.', 'info');
  };

  const toggleLikeHaircut = (id: string) => {
    setHaircuts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Create an appointment from client app -> immediately appears in barber portal
  const createAppointment = (
    data: Omit<Appointment, 'id' | 'code' | 'createdAt' | 'status'>
  ): Appointment => {
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      code: `LH-${randomCodeNum}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [newApt, ...prev]);
    showToast(
      '¡Cita Agendada Exitosamente!',
      `Código: ${newApt.code}. Tu barbero ${newApt.barberName} ya recibió la notificación.`,
      'success'
    );
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    const labels: Record<AppointmentStatus, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      in_progress: 'En Silla / Cortando',
      completed: 'Completada con éxito',
      cancelled: 'Cancelada',
    };
    showToast('Estado actualizado', `La cita ahora está en estado "${labels[status]}".`, 'info');
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    showToast('Cita cancelada', 'Se ha liberado el espacio en la agenda.', 'warning');
  };

  const updateServicePrice = (id: string, newPrice: number) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, price: Math.max(1, newPrice) } : srv))
    );
    showToast('Tarifa actualizada', 'El nuevo precio ya se muestra a los clientes.', 'success');
  };

  const addService = (data: Omit<Service, 'id'>): Service => {
    const newService: Service = {
      ...data,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
    showToast('Nuevo servicio agregado', `"${newService.name}" ha sido añadido al menú.`, 'success');
    return newService;
  };

  return (
    <BarberContext.Provider
      value={{
        haircuts,
        services,
        barbers,
        appointments,
        reviews,
        activeBarberId,
        setActiveBarberId,
        activeApp,
        setActiveApp,
        addHaircut,
        deleteHaircut,
        toggleLikeHaircut,
        createAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        updateServicePrice,
        addService,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </BarberContext.Provider>
  );
};

export const useBarberData = () => {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarberData must be used within a BarberProvider');
  }
  return context;
};
