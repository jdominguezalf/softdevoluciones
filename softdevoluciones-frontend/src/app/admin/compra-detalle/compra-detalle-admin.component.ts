import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Compra } from '../../core/models/compra.model';
import { CompraService } from '../../core/services/compra.service';

@Component({
  selector: 'app-compra-detalle-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compra-detalle-admin.component.html',
  styleUrl: './compra-detalle-admin.component.scss',
})
export class CompraDetalleAdminComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly compraService = inject(CompraService);

  compra = signal<Compra | null>(null);

  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('No se encontró el identificador de la compra');

      this.cargando.set(false);

      return;
    }

    this.cargarCompra(id);
  }

  cargarCompra(id: number): void {
    this.cargando.set(true);
    this.error.set('');

    this.compraService.obtenerCompraAdmin(id).subscribe({
      next: (response) => {
        this.compra.set(response);

        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo cargar el detalle de la compra');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/admin/compras']);
  }

  irDevoluciones(): void {
    this.router.navigate(['/admin/devoluciones']);
  }
}
