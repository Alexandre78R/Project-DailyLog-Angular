import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { authRoutes } from './features/auth/auth.routes';
import { journalRoutes } from './features/journal/journal.routes';
// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats.component').then(m => m.StatsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'journal',
    pathMatch: 'full',
  },
  ...authRoutes,
  ...journalRoutes,
  // {
  //   path: '',
  //   loadChildren: () => import('./features/auth/auth.modules').then(m => m.AuthRoutingModule)
  // },
];
