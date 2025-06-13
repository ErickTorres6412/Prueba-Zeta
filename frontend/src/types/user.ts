export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  //username: string;
  //role: string;
}

export interface CrearUsuario {
  nombre: string;
  apellidos: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

// En types/product.ts
export interface UsuarioResponse {
  error: boolean;
  status: number;
  body: Usuario[]; 
}
