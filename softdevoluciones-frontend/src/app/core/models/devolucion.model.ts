export interface DetalleDevolucionRequest {
  detalleCompraId: number;
  cantidad: number;
}

export interface CrearDevolucionRequest {
  compraId: number;
  motivo:
    | 'PRODUCTO_DEFECTUOSO'
    | 'PRODUCTO_INCORRECTO'
    | 'PRODUCTO_DANADO'
    | 'NO_CUMPLE_EXPECTATIVAS'
    | 'OTRO';
  comentario?: string;
  detalles: DetalleDevolucionRequest[];
}

export interface DetalleDevolucionResponse {
  id: number;
  cantidad: number;
  importe: number;
  detalleCompraId: number;
  productoNombre: string;
}

export interface SolicitudDevolucionResponse {
  id: number;
  fechaSolicitud: string;
  estado: 'SOLICITADA' | 'EN_REVISION' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA';
  motivo:
    | 'PRODUCTO_DEFECTUOSO'
    | 'PRODUCTO_INCORRECTO'
    | 'PRODUCTO_DANADO'
    | 'NO_CUMPLE_EXPECTATIVAS'
    | 'OTRO';
  comentario?: string;
  observacionOperador?: string;
  importe: number;
  compraId: number;
  detalles: DetalleDevolucionResponse[];
}
export interface CambiarEstadoDevolucionRequest {
  estado:
    | 'EN_REVISION'
    | 'APROBADA'
    | 'RECHAZADA'
    | 'COMPLETADA';

  observacion?: string;
}

export interface PaginaDevoluciones {
  content: SolicitudDevolucionResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
