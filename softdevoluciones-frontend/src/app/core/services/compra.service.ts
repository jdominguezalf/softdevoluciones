import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Compra } from '../models/compra.model';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private readonly apiUrl = `${environment.apiUrl}/api/compras`;

  private readonly adminUrl = `${environment.apiUrl}/api/admin/compras`;

  constructor(private http: HttpClient) {}

  listarMisCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/mis-compras`);
  }

  obtenerCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  listarTodasLasCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.adminUrl);
  }

  obtenerCompraAdmin(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.adminUrl}/${id}`);
  }
}
