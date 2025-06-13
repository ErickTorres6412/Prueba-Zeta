import { ApiClient } from './client';
import { UsuarioResponse, Usuario } from '@/types/user';

export class UsuariosService {
    constructor(private apiClient: ApiClient) { }

    /**
     * Obtener todos los usuarios
     */
    async getUsuarios(token: string): Promise<UsuarioResponse> {
        return this.apiClient.get<UsuarioResponse>('/usuarios', token);
    }


    /**
     * Obtener un usuario por ID
     */
    async getUsuarioById(id: number, token: string): Promise<{ error: boolean; status: number; body: Usuario }> {
        return this.apiClient.get<{ error: boolean; status: number; body: Usuario }>(`/usuarios/${id}`, token);
    }

    /**
       * Actualizar usuario
      */
    async actualizarUsuario(data: Partial<Usuario>, token: string): Promise<{ error: boolean; status: number; body: Usuario }> {
        return this.apiClient.put<{ error: boolean; status: number; body: Usuario }>(`/usuarios`, data, token);
    }
}