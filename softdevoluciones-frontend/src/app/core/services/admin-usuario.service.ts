import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminUsuario } from '../models/admin-usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUsuarioService {
  private readonly apiUrl = 'http://localhost:8080/api/admin/usuarios';

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<AdminUsuario[]> {
    return this.http.get<AdminUsuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<AdminUsuario> {
    return this.http.get<AdminUsuario>(`${this.apiUrl}/${id}`);
  }
}
