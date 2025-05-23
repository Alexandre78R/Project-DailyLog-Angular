import { Routes } from '@angular/router';

// export const routes: Routes = [];

export const routes: Routes = [
  {
    path: 'journal',
    loadComponent: () => import('./features/journal/journal-entry/journal-entry.component').then(m => m.JournalEntryComponent),
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/entry-list/entry-list.component').then(m => m.EntryListComponent),
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats-dashboard/stats-dashboard.component').then(m => m.StatsDashboardComponent),
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.modules').then(m => m.AuthRoutingModule)
  },
  {
    path: '',
    redirectTo: 'journal',
    pathMatch: 'full',
  },
];
