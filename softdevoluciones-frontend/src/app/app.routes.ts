import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';

import { ComprasComponent } from './cliente/compras/compras.component';
import { CompraDetalleComponent } from './cliente/compra-detalle/compra-detalle.component';
import { DevolucionFormComponent } from './cliente/devolucion-form/devolucion-form.component';
import { DevolucionesComponent } from './cliente/devoluciones/devoluciones.component';

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
    path: 'cliente/compras/:id',
    component: CompraDetalleComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['CLIENTE'],
    },
  },

  {
    path: 'cliente/compras/:id/devolucion',
    component: DevolucionFormComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['CLIENTE'],
    },
  },

  {
    path: 'cliente/devoluciones',
    component: DevolucionesComponent,
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
