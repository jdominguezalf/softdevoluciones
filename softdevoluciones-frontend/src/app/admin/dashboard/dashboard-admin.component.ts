import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { DevolucionService } from '../../core/services/devolucion.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss',
})
export class DashboardAdminComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly devolucionService = inject(DevolucionService);

  totalDevoluciones = signal(0);
  enRevision = signal(0);
  aprobadas = signal(0);
  rechazadas = signal(0);

  cargando = signal(true);
  error = signal('');

  usuario = this.authService.obtenerUsuario();

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando.set(true);
    this.error.set('');

    this.devolucionService.listarAdministrativas('', '', '', '', 0, 100).subscribe({
      next: (response) => {
        const devoluciones = response.content;

        this.totalDevoluciones.set(response.totalElements);

        this.enRevision.set(
          devoluciones.filter((devolucion) => devolucion.estado === 'EN_REVISION').length,
        );

        this.aprobadas.set(
          devoluciones.filter((devolucion) => devolucion.estado === 'APROBADA').length,
        );

        this.rechazadas.set(
          devoluciones.filter((devolucion) => devolucion.estado === 'RECHAZADA').length,
        );

        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo cargar el resumen del sistema');
      },
    });
  }

  irDevoluciones(): void {
    this.router.navigate(['/admin/devoluciones']);
  }

  irCompras(): void {
    this.router.navigate(['/admin/compras']);
  }

  irUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
