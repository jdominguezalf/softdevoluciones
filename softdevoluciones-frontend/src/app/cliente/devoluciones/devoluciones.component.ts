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

        this.error.set(err?.error?.mensaje ?? 'No se pudieron cargar las devoluciones');
      },
    });
  }

  volverCompras(): void {
    this.router.navigate(['/cliente/compras']);
  }
}
