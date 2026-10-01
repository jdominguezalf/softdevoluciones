export interface AdminUsuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'OPERADOR' | 'ADMIN';
}
