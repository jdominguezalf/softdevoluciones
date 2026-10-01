import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
})
export class DashboardAdminComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  irDevoluciones(): void {
    this.router.navigate(['/admin/devoluciones']);
  }

  irCompras(): void {
    this.router.navigate(['/admin/compras']);
  }

  irUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }

  cerrarSesion(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
