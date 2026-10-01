import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  SolicitudDevolucionResponse
} from '../../core/models/devolucion.model';

import {
  DevolucionService
} from '../../core/services/devolucion.service';

import {
  AuthService
} from '../../core/services/auth.service';

@Component({
  selector: 'app-devoluciones-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './devoluciones-admin.component.html',
  styleUrl: './devoluciones-admin.component.scss'
})
export class DevolucionesAdminComponent implements OnInit {

  private readonly devolucionService =
    inject(DevolucionService);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  devoluciones =
    signal<SolicitudDevolucionResponse[]>([]);

  cargando = signal(true);
  error = signal('');

  paginaActual = signal(0);
  totalPaginas = signal(0);
  totalElementos = signal(0);

  estado = '';
  motivo = '';
  desde = '';
  hasta = '';

  ngOnInit(): void {
    this.cargarDevoluciones();
  }

  cargarDevoluciones(
    pagina: number = 0
  ): void {

    this.cargando.set(true);
    this.error.set('');

    this.devolucionService
      .listarAdministrativas(
        this.estado,
        this.motivo,
        this.desde,
        this.hasta,
        pagina,
        10
      )
      .subscribe({

        next: response => {

          this.devoluciones.set(
            response.content
          );

          this.paginaActual.set(
            response.number
          );

          this.totalPaginas.set(
            response.totalPages
          );

          this.totalElementos.set(
            response.totalElements
          );

          this.cargando.set(false);
        },

        error: err => {

          this.cargando.set(false);

          this.error.set(
            err?.error?.mensaje
            ?? 'No se pudieron cargar las devoluciones'
          );
        }
      });
  }

  aplicarFiltros(): void {
    this.cargarDevoluciones(0);
  }

  limpiarFiltros(): void {

    this.estado = '';
    this.motivo = '';
    this.desde = '';
    this.hasta = '';

    this.cargarDevoluciones(0);
  }

  paginaAnterior(): void {

    if (this.paginaActual() > 0) {

      this.cargarDevoluciones(
        this.paginaActual() - 1
      );
    }
  }

  paginaSiguiente(): void {

    if (
      this.paginaActual() + 1
      < this.totalPaginas()
    ) {

      this.cargarDevoluciones(
        this.paginaActual() + 1
      );
    }
  }

  cambiarEstado(
    devolucion: SolicitudDevolucionResponse,
    nuevoEstado:
      'EN_REVISION'
      | 'APROBADA'
      | 'RECHAZADA'
      | 'COMPLETADA'
  ): void {

    let observacion = '';

    if (nuevoEstado === 'RECHAZADA') {

      observacion =
        window.prompt(
          'Ingrese el motivo del rechazo:'
        ) ?? '';

      if (!observacion.trim()) {
        return;
      }
    }

    const confirmar =
      window.confirm(
        `¿Cambiar la devolución #${devolucion.id} a ${nuevoEstado}?`
      );

    if (!confirmar) {
      return;
    }

    this.devolucionService
      .cambiarEstado(
        devolucion.id,
        {
          estado: nuevoEstado,
          observacion
        }
      )
      .subscribe({

        next: () => {

          this.cargarDevoluciones(
            this.paginaActual()
          );
        },

        error: err => {

          this.error.set(
            err?.error?.mensaje
            ?? 'No se pudo cambiar el estado'
          );
        }
      });
  }

  esAdmin(): boolean {
    return this.authService.tieneRol('ADMIN');
  }

  irPanel(): void {

    this.router.navigate([
      '/admin'
    ]);
  }

  cerrarSesion(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}
