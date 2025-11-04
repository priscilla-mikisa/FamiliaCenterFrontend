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
  topic?: string;
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
  user?: {
    id?: string;
    user_id?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
  };
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

export interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  location: string;
  format: string;
  topics: string[];
  about: string;
  about2: string;
  learning_points: string[];
  related_events: RelatedEvent[] | null;
  isRegistered?: boolean;
  isPublic?: boolean;
  registeredCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RelatedEvent {
  id: string;
  title: string;
  date: string;
}

export interface ForumListResponse {
  success: boolean;
  data: Forum[];
}

export interface ForumLatestResponse {
  success: boolean;
  data: Forum[];
}

export interface ForumResponse {
  success: boolean;
  data: Forum;
}

export interface ForumListPaginatedResponse {
  success: boolean;
  data: {
    forums: Forum[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
