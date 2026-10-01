import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';

import { ComprasComponent } from './cliente/compras/compras.component';
import { CompraDetalleComponent } from './cliente/compra-detalle/compra-detalle.component';
import { DevolucionFormComponent } from './cliente/devolucion-form/devolucion-form.component';
import { DevolucionesComponent } from './cliente/devoluciones/devoluciones.component';

import { DashboardAdminComponent } from './admin/dashboard/dashboard-admin.component';
import { DevolucionesAdminComponent } from './admin/devoluciones/devoluciones-admin.component';
import { ComprasAdminComponent } from './admin/compras/compras-admin.component';
import { CompraDetalleAdminComponent } from './admin/compra-detalle/compra-detalle-admin.component';
import { UsuariosAdminComponent } from './admin/usuarios/usuarios-admin.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'cliente/compras',
    component: ComprasComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['CLIENTE']
    }
  },

  {
    path: 'cliente/compras/:id',
    component: CompraDetalleComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['CLIENTE']
    }
  },

  {
    path: 'cliente/compras/:id/devolucion',
    component: DevolucionFormComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['CLIENTE']
    }
  },

  {
    path: 'cliente/devoluciones',
    component: DevolucionesComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['CLIENTE']
    }
  },

  {
    path: 'admin',
    component: DashboardAdminComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['ADMIN']
    }
  },

  {
    path: 'admin/devoluciones',
    component: DevolucionesAdminComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        'OPERADOR',
        'ADMIN'
      ]
    }
  },

  {
    path: 'admin/compras',
    component: ComprasAdminComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['ADMIN']
    }
  },

  {
    path: 'admin/compras/:id',
    component: CompraDetalleAdminComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['ADMIN']
    }
  },

  {
    path: 'admin/usuarios',
    component: UsuariosAdminComponent,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['ADMIN']
    }
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
