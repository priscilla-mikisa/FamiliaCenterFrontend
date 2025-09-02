export interface User {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  speciality?: string;
  bio?: string;
  userType: string;
  phone?: string;
}

export interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  notes?: string;
  feedback?: string;
  start_time: string;
  meeting_link?: string;
  end_time?: string;
  session_date: string;
  session_time: string;
  duration: number;
  counselor: {
    id: string;
    name: string;
    specialization: string;
  };
  counsellor_name?: string;
  type?: string;
  status: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  is_enrolled: boolean;
  current_week: number;
  total_weeks: number;
  session_count: number;
  resources_count: number;
  next_session?: string | null;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  category: string;
  size: string;
  url: string;
  created_at: string;
}

export interface RecordedSession {
  id: number;
  client_name: string;
  date: string;
  type: string;
  duration: string;
  size: string;
}
