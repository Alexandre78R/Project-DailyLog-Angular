import { Routes } from '@angular/router';
import { AuthGuard } from './features/auth/guards/auth.guard';
// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: 'journal',
    loadComponent: () => import('./features/journal/journal-entry/journal-entry.component').then(m => m.JournalEntryComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/entry-list/entry-list.component').then(m => m.EntryListComponent),
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
