import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';

// Layouts
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ClientLayoutComponent } from './layout/client-layout/client-layout.component';

// Cliente
import { ComprasComponent } from './cliente/compras/compras.component';
import { CompraDetalleComponent } from './cliente/compra-detalle/compra-detalle.component';
import { DevolucionFormComponent } from './cliente/devolucion-form/devolucion-form.component';
import { DevolucionesComponent } from './cliente/devoluciones/devoluciones.component';
import { DevolucionDetalleComponent } from './cliente/devolucion-detalle/devolucion-detalle.component';

// Admin / Operador
import { DashboardAdminComponent } from './admin/dashboard/dashboard-admin.component';
import { DevolucionesAdminComponent } from './admin/devoluciones/devoluciones-admin.component';
import { ComprasAdminComponent } from './admin/compras/compras-admin.component';
import { CompraDetalleAdminComponent } from './admin/compra-detalle/compra-detalle-admin.component';
import { UsuariosAdminComponent } from './admin/usuarios/usuarios-admin.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // =========================
  // AUTENTICACIÓN
  // =========================

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'registro',
    component: RegistroComponent,
  },

  // =========================
  // CLIENTE
  // =========================

  {
    path: 'cliente',
    component: ClientLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['CLIENTE'],
    },

    children: [
      {
        path: '',
        redirectTo: 'compras',
        pathMatch: 'full',
      },

      {
        path: 'compras',
        component: ComprasComponent,
      },

      {
        path: 'compras/:id/devolucion',
        component: DevolucionFormComponent,
      },

      {
        path: 'compras/:id',
        component: CompraDetalleComponent,
      },

      {
        path: 'devoluciones/:id',
        component: DevolucionDetalleComponent,
      },

      {
        path: 'devoluciones',
        component: DevolucionesComponent,
      },
    ],
  },

  // =========================
  // ADMIN / OPERADOR
  // =========================

  {
    path: 'admin',
    component: AppLayoutComponent,
    canActivate: [authGuard],

    children: [
      // Dashboard - solo ADMIN
      {
        path: '',
        component: DashboardAdminComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMIN'],
        },
      },

      // Devoluciones - OPERADOR y ADMIN
      {
        path: 'devoluciones',
        component: DevolucionesAdminComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['OPERADOR', 'ADMIN'],
        },
      },

      // Compras - solo ADMIN
      {
        path: 'compras',
        component: ComprasAdminComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMIN'],
        },
      },

      // Detalle de compra - solo ADMIN
      {
        path: 'compras/:id',
        component: CompraDetalleAdminComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMIN'],
        },
      },

      // Usuarios - solo ADMIN
      {
        path: 'usuarios',
        component: UsuariosAdminComponent,
        canActivate: [roleGuard],
        data: {
          roles: ['ADMIN'],
        },
      },
    ],
  },

  // =========================
  // REDIRECCIONES
  // =========================

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
