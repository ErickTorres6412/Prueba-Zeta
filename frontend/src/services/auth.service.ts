
import { ApiClient } from './client';
import { 
  LoginCredentials, 
  LoginResponse, 
  RegisterCredentials, 
  RegisterResponse 
} from '@/types/auth';

export class AuthService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.apiClient.post<LoginResponse>('/auth/login', credentials);
  }

  /**
   * Registrar nuevo usuario
   */
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    return this.apiClient.post<RegisterResponse>('/usuarios/register', credentials);
  }

  /**
   * Cerrar sesión (si el backend lo requiere)
   */
  async logout(token: string): Promise<void> {
    return this.apiClient.post<void>('/auth/logout', {}, token);
  }
}