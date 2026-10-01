export interface DetalleCompra {
  id: number;
  cantidad: number;
  precioUnitario: number;
  productoId: number;
  productoNombre: string;
}

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  detalles: DetalleCompra[];
}
