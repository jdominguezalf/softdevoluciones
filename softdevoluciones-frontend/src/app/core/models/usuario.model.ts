export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'OPERADOR' | 'ADMIN';
}
