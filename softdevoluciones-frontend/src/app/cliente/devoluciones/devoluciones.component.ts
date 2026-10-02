import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { SolicitudDevolucionResponse } from '../../core/models/devolucion.model';

import { DevolucionService } from '../../core/services/devolucion.service';

@Component({
  selector: 'app-devoluciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devoluciones.component.html',
  styleUrl: './devoluciones.component.scss',
})
export class DevolucionesComponent implements OnInit {
  private readonly devolucionService = inject(DevolucionService);

  private readonly router = inject(Router);

  devoluciones = signal<SolicitudDevolucionResponse[]>([]);

  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargarDevoluciones();
  }

  cargarDevoluciones(): void {
    this.cargando.set(true);
    this.error.set('');

    this.devolucionService.listarMisDevoluciones().subscribe({
      next: (response) => {
        this.devoluciones.set(response);
        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudieron cargar tus devoluciones');
      },
    });
  }

  volverCompras(): void {
    this.router.navigate(['/cliente/compras']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/cliente/devoluciones', id]);
  }

  cantidadPorEstado(
    estado: 'SOLICITADA' | 'EN_REVISION' | 'APROBADA' | 'RECHAZADA' | 'COMPLETADA',
  ): number {
    return this.devoluciones().filter((devolucion) => devolucion.estado === estado).length;
  }

  estadoTexto(estado: string): string {
    switch (estado) {
      case 'SOLICITADA':
        return 'Solicitada';

      case 'EN_REVISION':
        return 'En revisión';

      case 'APROBADA':
        return 'Aprobada';

      case 'RECHAZADA':
        return 'Rechazada';

      case 'COMPLETADA':
        return 'Completada';

      default:
        return estado;
    }
  }

  motivoTexto(motivo: string): string {
    switch (motivo) {
      case 'PRODUCTO_DEFECTUOSO':
        return 'Producto defectuoso';

      case 'PRODUCTO_INCORRECTO':
        return 'Producto incorrecto';

      case 'PRODUCTO_DANADO':
        return 'Producto dañado';

      case 'NO_CUMPLE_EXPECTATIVAS':
        return 'No cumple expectativas';

      case 'OTRO':
        return 'Otro';

      default:
        return motivo;
    }
  }
}
