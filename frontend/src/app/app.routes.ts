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
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '',
    redirectTo: 'journal',
    pathMatch: 'full',
  },
];
