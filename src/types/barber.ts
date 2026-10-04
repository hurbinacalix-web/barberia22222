export type HaircutCategory = 'fade' | 'beard' | 'classic' | 'modern' | 'design';

export interface Haircut {
  id: string;
  title: string;
  barberId: string;
  barberName: string;
  category: HaircutCategory;
  imageUrl: string;
  description: string;
  date: string;
  tags: string[];
  likes: number;
}

export type ServiceCategory = 'hair' | 'beard' | 'combo' | 'spa';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  durationMinutes: number;
  description: string;
  included: string[];
  isPopular?: boolean;
}

export interface Barber {
  id: string;
  name: string;
  nickname: string;
  role: string;
  avatar: string;
  experience: string;
  specialties: string[];
  rating: number;
  cutsCount: number;
  bio: string;
  instagram: string;
  phone: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  code: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  barberName: string;
  rating: number;
  comment: string;
  date: string;
}
