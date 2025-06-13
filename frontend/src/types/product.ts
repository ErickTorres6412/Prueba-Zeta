export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  created_at: string; 
  updated_at: string;
  url_imagen?: string | null;
}


// En types/product.ts
export interface ProductsResponse {
  error: boolean;
  status: number;
  body: Product[]; 
}

export interface CreateProductData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: number;
  imagen?: string;
}

export interface DeleteProduct {
  id: number;
}