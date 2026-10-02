import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  signal
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly fb =
    inject(FormBuilder);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  cargando = signal(false);
  error = signal('');
  mostrarPassword = signal(false);

  formulario = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  iniciarSesion(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const request = {
      email:
        this.formulario.controls.email.value ?? '',

      password:
        this.formulario.controls.password.value ?? ''
    };

    this.authService
      .login(request)
      .subscribe({

        next: response => {

          this.cargando.set(false);

          switch (response.usuario.rol) {

            case 'CLIENTE':
              this.router.navigate([
                '/cliente/compras'
              ]);
              break;

            case 'OPERADOR':
              this.router.navigate([
                '/admin/devoluciones'
              ]);
              break;

            case 'ADMIN':
              this.router.navigate([
                '/admin'
              ]);
              break;
          }
        },

        error: err => {

          this.cargando.set(false);

          this.error.set(
            err?.error?.mensaje
            ?? 'No se pudo iniciar sesión'
          );
        }
      });
  }

  alternarPassword(): void {

    this.mostrarPassword.update(
      valor => !valor
    );
  }

  irRegistro(): void {

    this.router.navigate([
      '/registro'
    ]);
  }
}
