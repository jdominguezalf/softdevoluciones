import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { ComprasComponent } from './cliente/compras/compras.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'cliente/compras',
    component: ComprasComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['CLIENTE'],
    },
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
