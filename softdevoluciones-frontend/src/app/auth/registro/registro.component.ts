import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);

  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  cargando = signal(false);
  error = signal('');
  mostrarPassword = signal(false);

  formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const request = {
      nombre: this.formulario.controls.nombre.value ?? '',

      email: this.formulario.controls.email.value ?? '',

      password: this.formulario.controls.password.value ?? '',
    };

    this.authService.registrar(request).subscribe({
      next: () => {
        this.cargando.set(false);

        this.router.navigate(['/cliente/compras']);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo crear la cuenta');
      },
    });
  }

  alternarPassword(): void {
    this.mostrarPassword.update((valor) => !valor);
  }

  irLogin(): void {
    this.router.navigate(['/login']);
  }
}
