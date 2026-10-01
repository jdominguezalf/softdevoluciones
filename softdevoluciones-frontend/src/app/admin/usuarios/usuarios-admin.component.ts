import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AdminUsuario } from '../../core/models/admin-usuario.model';
import { AdminUsuarioService } from '../../core/services/admin-usuario.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.scss',
})
export class UsuariosAdminComponent implements OnInit {
  private readonly usuarioService = inject(AdminUsuarioService);

  private readonly router = inject(Router);

  usuarios = signal<AdminUsuario[]>([]);

  cargando = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    this.error.set('');

    this.usuarioService.listarUsuarios().subscribe({
      next: (response) => {
        this.usuarios.set(response);
        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudieron cargar los usuarios');
      },
    });
  }

  irCompras(): void {
    this.router.navigate(['/admin/compras']);
  }

  irDevoluciones(): void {
    this.router.navigate(['/admin/devoluciones']);
  }
}
