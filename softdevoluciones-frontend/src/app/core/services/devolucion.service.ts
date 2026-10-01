import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CrearDevolucionRequest, SolicitudDevolucionResponse } from '../models/devolucion.model';

@Injectable({
  providedIn: 'root',
})
export class DevolucionService {
  private readonly apiUrl = 'http://localhost:8080/api/devoluciones';

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
}
