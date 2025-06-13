export interface User {
  username: string;
  role: string;
  user_id: number;
}

export interface LoginResponse {
  error: boolean;
  status: number;
  body: {
    token: string;
    user: User;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterCredentials {
  nombre: string;
  apellidos: string;
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  error: boolean;
  status: number;
  body: string;
}