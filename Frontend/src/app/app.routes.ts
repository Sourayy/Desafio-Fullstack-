import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/company',
    pathMatch: 'full',
  },
  {
    path: 'companies',
    loadComponent: () => import('./domain/pages/company/company').then((m) => m.Company),
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./domain/pages/supplier/supplier').then((m) => m.Supplier),
  },
  {
    path: '**',
    redirectTo: '/companies',
  },
];
