// services/api/index.ts - Punto de entrada unificado para todos los servicios
import { ApiClient } from './client';
import { AuthService } from './auth.service';
import { ProductosService } from './ProductosService';
import { UsuariosService } from './UsuariosService';
import { CategoriasService } from './CategoriasService';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Instancia única del cliente API
const apiClient = new ApiClient(API_BASE_URL);

// Instancias de los servicios
export const authService = new AuthService(apiClient);
export const productosService = new ProductosService(apiClient);
export const usuariosService = new UsuariosService(apiClient);
export const categoriasService = new CategoriasService(apiClient);

// Exportar también el cliente base por si se necesita
export { apiClient };

// Exportar tipos comunes
export type { ApiError } from './client';
export type { Product, ProductsResponse, CreateProductData } from '../types/product';
export type { Usuario } from '../types/user';