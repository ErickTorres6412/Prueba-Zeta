import { ApiClient } from './client';
import { categoria, CategoriasResponse, CreateCategoriaData, DeleteCategoria } from '@/types/categoria';

export class CategoriasService {
    constructor(private apiClient: ApiClient) { }

    /**
     * Obtener todos las categorias
     */
    async getCategorias(token: string): Promise<CategoriasResponse> {
        return this.apiClient.get<CategoriasResponse>('/categorias', token);
    }

    /**
     * Obtener un categoria por ID
     */
    async getCategoriaById(id: number, token: string): Promise<{ error: boolean; status: number; body: categoria }> {
        return this.apiClient.get<{ error: boolean; status: number; body: categoria }>(`/categorias/${id}`, token);
    }

    /**
       * Actualizar categoria
      */
    async actualizarCategoria(data: Partial<categoria>, token: string): Promise<{ error: boolean; status: number; body: categoria }> {
        return this.apiClient.put<{ error: boolean; status: number; body: categoria }>(`/categorias`, data, token);
    }

    /**
       * Crear nueva categorias
       */
    async crearCategoria(data: CreateCategoriaData, token: string): Promise<{ error: boolean; status: number; body: categoria }> {
        return this.apiClient.post<{ error: boolean; status: number; body: categoria }>('/categorias', data, token);
    }

    /**
       * Eliminar categoria
       */
    async eliminarCategoria(data: DeleteCategoria, token: string): Promise<{ error: boolean; status: number; message: string }> {
        return this.apiClient.delete<{ error: boolean; status: number; message: string }>(`/categorias`, data, token);
    }
}