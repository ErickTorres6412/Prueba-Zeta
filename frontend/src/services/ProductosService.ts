// services/api/products.service.ts - Servicio específico para productos

import { ApiClient } from './client';
import { 
    ProductsResponse, 
    CreateProductData, 
    Product,
    DeleteProduct
} from '@/types/product';

export class ProductosService {
  constructor(private apiClient: ApiClient) {}

  /**
   * Obtener todos los productos
   */
  async getProductos(token: string): Promise<ProductsResponse> {
    return this.apiClient.get<ProductsResponse>('/productos', token);
  }


  /**
   * Obtener un producto por ID
   */
  async getProductosById(id: number, token: string): Promise<{ error: boolean; status: number; body: Product }> {
    return this.apiClient.get<{ error: boolean; status: number; body: Product }>(`/productos/${id}`, token);
  }

  /**
   * Crear nuevo producto
   */
  async crearProducto(data: CreateProductData, token: string): Promise<{ error: boolean; status: number; body: Product }> {
    return this.apiClient.post<{ error: boolean; status: number; body: Product }>('/productos', data, token);
  }

  /**
   * Actualizar producto
   */
  async actualizarProducto(data: Partial<CreateProductData>, token: string): Promise<{ error: boolean; status: number; body: Product }> {
    return this.apiClient.put<{ error: boolean; status: number; body: Product }>(`/productos`, data, token);
  }

  /**
   * Eliminar producto
   */
  async eliminarProducto(data: DeleteProduct, token: string): Promise<{ error: boolean; status: number; message: string }> {
    return this.apiClient.delete<{ error: boolean; status: number; message: string }>(`/productos`, data, token);
  }
}