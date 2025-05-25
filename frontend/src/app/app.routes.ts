import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';
// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: 'journal',
    loadComponent: () => import('./features/journal/journal/journal.component').then(m => m.JournalComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'journal/add',
    loadComponent: () =>
      import('./features/journal/journal-entry-add/journal-entry-add.component').then(m => m.JournalEntryAddComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./features/journal/history/history.component').then(m => m.HistoryComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats-dashboard/stats-dashboard.component').then(m => m.StatsDashboardComponent),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'journal',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.modules').then(m => m.AuthRoutingModule)
  },
];
