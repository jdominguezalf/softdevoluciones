import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Compra } from '../../core/models/compra.model';
import { CompraService } from '../../core/services/compra.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.scss',
})
export class ComprasComponent implements OnInit {
  private readonly compraService = inject(CompraService);

  private readonly router = inject(Router);

  compras = signal<Compra[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargarCompras();
  }

  cargarCompras(): void {
    this.cargando.set(true);
    this.error.set('');

    this.compraService.listarMisCompras().subscribe({
      next: (response) => {
        this.compras.set(response);
        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudieron cargar tus compras');
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/cliente/compras', id]);
  }

  verMisDevoluciones(): void {
    this.router.navigate(['/cliente/devoluciones']);
  }

  cantidadEntregadas(): number {
    return this.compras().filter((compra) => compra.estado === 'ENTREGADA').length;
  }

  totalGastado(): number {
    return this.compras().reduce((total, compra) => total + Number(compra.total), 0);
  }
}
