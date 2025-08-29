// src/types/counselor.ts
export interface CounselorClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  type: 'individual' | 'couple' | 'family';
  status: 'active' | 'inactive' | 'completed';
  program?: string;
  sessionsCompleted: number;
  totalSessions: number;
  progress: number;
  nextSession?: string;
  startDate: string;
  lastSession?: string;
  sessions: CounselorSession[];
  notes: string;
}

export interface CounselorSession {
  id: number;
  client_id: number;
  client_name: string;
  date: string;
  time: string;
  duration: number;
  type: 'individual' | 'couple' | 'family' | 'consultation';
  program?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  notes?: string;
  actionItems?: string;
  dayIndex?: number;
  hour?: number;
  canStart?: boolean;
}

export interface CounselorProgram {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  weeks: number;
  enrolled: number;
  capacity: number;
  sessions: number;
  resources: number;
  progress: number;
  status: 'active' | 'draft' | 'completed' | 'archived';
  completed: number;
  avgProgress: number;
  objectives?: string[];
  programSessions?: ProgramSession[];
  programResources?: ProgramResource[];
}

export interface ProgramSession {
  id: number;
  week: number;
  title: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

export interface ProgramResource {
  id: number;
  title: string;
  type: string;
  size: string;
  url?: string;
  description?: string;
}

export interface RecordedSession {
  id: number;
  client_name: string;
  date: string;
  type: string;
  duration: string;
  size: string;
  url?: string;
}

export interface CounselorAvailability {
  startTime: string;
  endTime: string;
  workingDays: string[];
  timeZone?: string;
  breakDuration?: number;
}

export interface Appointment {
  id: number;
  clientId: number;
  client: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  dayIndex?: number;
  hour?: number;
  canStart?: boolean;
}

export interface CounselorAnalytics {
  sessionCompletionRate: number;
  averageRating: number;
  activeClients: number;
  totalSessions: number;
  monthlyData: MonthlyData[];
  clientSatisfaction: SatisfactionData[];
  programEffectiveness: ProgramEffectivenessData[];
}

export interface MonthlyData {
  month: string;
  sessions: number;
  clients: number;
  completionRate: number;
}

export interface SatisfactionData {
  rating: number;
  count: number;
  percentage: number;
}

export interface ProgramEffectivenessData {
  programName: string;
  participants: number;
  completionRate: number;
  averageProgress: number;
}

export interface CounselorProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization: string;
  license?: string;
  experience?: number;
  bio?: string;
  availability: CounselorAvailability;
  rating?: number;
  totalSessions?: number;
}

export interface CounselorResource {
  id: string;
  title: string;
  description?: string;
  type: 'PDF' | 'Video' | 'Audio' | 'Document';
  category: string;
  size: string;
  url: string;
  uploadDate: string;
  isPublic: boolean;
  programId?: number;
}
