import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [() =>
      import('./guards/auth.no-auth.guard').then(m => m.NoAuthGuard)
    ],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [() =>
      import('./guards/auth.no-auth.guard').then(m => m.NoAuthGuard)
    ],
  },
];