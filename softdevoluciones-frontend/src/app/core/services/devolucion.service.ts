import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  CambiarEstadoDevolucionRequest,
  CrearDevolucionRequest,
  PaginaDevoluciones,
  SolicitudDevolucionResponse,
} from '../models/devolucion.model';

@Injectable({
  providedIn: 'root',
})
export class DevolucionService {
  private readonly apiUrl = `${environment.apiUrl}/api/devoluciones`;

  private readonly adminUrl = `${environment.apiUrl}/api/admin/devoluciones`;

  constructor(private http: HttpClient) {}

  crearSolicitud(request: CrearDevolucionRequest): Observable<SolicitudDevolucionResponse> {
    return this.http.post<SolicitudDevolucionResponse>(this.apiUrl, request);
  }

  listarMisDevoluciones(): Observable<SolicitudDevolucionResponse[]> {
    return this.http.get<SolicitudDevolucionResponse[]>(`${this.apiUrl}/mis-devoluciones`);
  }

  obtenerDevolucion(id: number): Observable<SolicitudDevolucionResponse> {
    return this.http.get<SolicitudDevolucionResponse>(`${this.apiUrl}/${id}`);
  }

  listarAdministrativas(
    estado?: string,
    motivo?: string,
    desde?: string,
    hasta?: string,
    page = 0,
    size = 10,
  ): Observable<PaginaDevoluciones> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (estado) {
      params = params.set('estado', estado);
    }

    if (motivo) {
      params = params.set('motivo', motivo);
    }

    if (desde) {
      params = params.set('desde', desde);
    }

    if (hasta) {
      params = params.set('hasta', hasta);
    }

    return this.http.get<PaginaDevoluciones>(this.adminUrl, { params });
  }

  cambiarEstado(
    id: number,
    request: CambiarEstadoDevolucionRequest,
  ): Observable<SolicitudDevolucionResponse> {
    return this.http.patch<SolicitudDevolucionResponse>(`${this.adminUrl}/${id}/estado`, request);
  }
}
