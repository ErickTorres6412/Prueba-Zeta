export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Método genérico para hacer peticiones HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      // Configurar headers base y mezclar con los opcionales
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers, // Los headers específicos pueden sobrescribir los defaults
        },
      };

      console.log('Enviando petición:', {
        url,
        method: config.method,
        headers: config.headers,
        body: config.body
      });

      const response = await fetch(url, config);
      console.log('Respuesta recibida:', response);

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en request:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión con el servidor');
    }
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private async handleHttpError(response: Response): Promise<never> {
    const contentType = response.headers.get('content-type');
    
    let errorMessage = `Error ${response.status}`;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }
    }

    // Errores específicos por código de estado
    switch (response.status) {
      case 400:
        throw new Error(errorMessage || 'Datos inválidos');
      case 401:
        throw new Error('TOKEN_EXPIRED');
      case 403:
        throw new Error('No tienes permisos para realizar esta acción');
      case 404:
        throw new Error('Recurso no encontrado');
      case 409:
        throw new Error(errorMessage || 'Conflicto - El recurso ya existe');
      case 422:
        throw new Error(errorMessage || 'Error de validación');
      case 500:
        throw new Error('Error interno del servidor');
      default:
        throw new Error(errorMessage);
    }
  }

  /**
   * Petición GET
   */
  async get<T>(endpoint: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  /**
   * Petición POST
   */
  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Petición PUT
   */
  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Petición DELETE
   */
  async delete<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method: 'DELETE',
      headers,
    };

    // ESTO ES LO QUE FALTABA: Enviar el data en el body
    if (data) {
      console.log('Enviando datos en DELETE:', data);
      config.body = JSON.stringify(data);
    }

    return this.request<T>(endpoint, config);
  }

}