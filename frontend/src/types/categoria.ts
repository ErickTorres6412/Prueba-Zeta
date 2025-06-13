export interface categoria {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface CategoriasResponse {
    error: boolean;
    status: number;
    body: categoria[];
}

export interface CreateCategoriaData {
    nombre: string;
    descripcion: string;
}

export interface DeleteCategoria {
  id: number;
}