import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss'
})
export class ClientLayoutComponent {

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  usuario =
    this.authService.obtenerUsuario();

  cerrarSesion(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}
