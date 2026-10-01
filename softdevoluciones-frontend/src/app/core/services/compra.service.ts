import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Compra } from '../models/compra.model';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  private readonly apiUrl = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient) {}

  listarMisCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/mis-compras`);
  }

  obtenerCompra(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }
}
