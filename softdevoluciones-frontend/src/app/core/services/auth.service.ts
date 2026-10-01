import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { RegistroRequest } from '../models/registro-request.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  private readonly tokenKey = 'softdevoluciones_token';
  private readonly usuarioKey = 'softdevoluciones_usuario';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.obtenerUsuarioGuardado());

  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.guardarSesion(response)));
  }

  registrar(request: RegistroRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/registro`, request)
      .pipe(tap((response) => this.guardarSesion(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);

    this.usuarioSubject.next(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  obtenerUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  tieneRol(rol: 'CLIENTE' | 'OPERADOR' | 'ADMIN'): boolean {
    return this.obtenerUsuario()?.rol === rol;
  }

  private guardarSesion(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);

    localStorage.setItem(this.usuarioKey, JSON.stringify(response.usuario));

    this.usuarioSubject.next(response.usuario);
  }

  private obtenerUsuarioGuardado(): Usuario | null {
    const usuario = localStorage.getItem(this.usuarioKey);

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario);
    } catch {
      return null;
    }
  }
}
