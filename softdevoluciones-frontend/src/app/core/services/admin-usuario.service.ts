import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AdminUsuario } from '../models/admin-usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/api/admin/usuarios`;

  constructor(private http: HttpClient) {}

  listarUsuarios(): Observable<AdminUsuario[]> {
    return this.http.get<AdminUsuario[]>(this.apiUrl);
  }

  obtenerUsuario(id: number): Observable<AdminUsuario> {
    return this.http.get<AdminUsuario>(`${this.apiUrl}/${id}`);
  }
}
