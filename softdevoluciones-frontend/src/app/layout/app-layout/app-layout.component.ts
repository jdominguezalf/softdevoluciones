import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  usuario = this.authService.obtenerUsuario();

  esAdmin(): boolean {
    return this.usuario?.rol === 'ADMIN';
  }

  esOperador(): boolean {
    return this.usuario?.rol === 'OPERADOR';
  }

  cerrarSesion(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}
