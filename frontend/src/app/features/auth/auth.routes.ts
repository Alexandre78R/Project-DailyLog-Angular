import { Routes } from '@angular/router';
import { NoAuthGuard } from './guards/auth.no-auth.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [NoAuthGuard],
  },
];