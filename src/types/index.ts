export interface User {
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  userType: string;
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

// Add to src/types/index.ts
export interface Session {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  duration: number;
  counselor: {
    id: number;
    name: string;
    specialization: string;
  };
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
  next_session?: string;
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
