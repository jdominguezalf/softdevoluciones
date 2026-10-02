import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SolicitudDevolucionResponse } from '../../core/models/devolucion.model';

import { DevolucionService } from '../../core/services/devolucion.service';

@Component({
  selector: 'app-devolucion-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devolucion-detalle.component.html',
  styleUrl: './devolucion-detalle.component.scss',
})
export class DevolucionDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly devolucionService = inject(DevolucionService);

  devolucion = signal<SolicitudDevolucionResponse | null>(null);

  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('No se encontró la solicitud seleccionada');

      this.cargando.set(false);

      return;
    }

    this.cargarDevolucion(id);
  }

  cargarDevolucion(id: number): void {
    this.cargando.set(true);
    this.error.set('');

    this.devolucionService.obtenerDevolucion(id).subscribe({
      next: (response) => {
        this.devolucion.set(response);
        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo cargar la devolución');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/cliente/devoluciones']);
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
