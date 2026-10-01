import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';

import { CompraService } from '../../core/services/compra.service';
import { Compra } from '../../core/models/compra.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.scss',
})
export class ComprasComponent implements OnInit {
  private readonly compraService = inject(CompraService);
  private readonly authService = inject(AuthService);
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

        this.error.set(err?.error?.mensaje ?? 'No se pudieron cargar las compras');
      },
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/cliente/compras', id]);
  }

  cerrarSesion(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
  verMisDevoluciones(): void {
    this.router.navigate(['/cliente/devoluciones']);
  }
}
