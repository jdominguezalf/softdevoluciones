import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { Compra } from '../../core/models/compra.model';
import { CompraService } from '../../core/services/compra.service';

@Component({
  selector: 'app-compras-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.scss',
})
export class ComprasAdminComponent implements OnInit {
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

    this.compraService.listarTodasLasCompras().subscribe({
      next: (response) => {
        this.compras.set(response);
        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudieron cargar las compras');
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/admin/compras', id]);
  }

  irDevoluciones(): void {
    this.router.navigate(['/admin/devoluciones']);
  }

  irUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }
  irPanel(): void {
    this.router.navigate(['/admin']);
  }
}
