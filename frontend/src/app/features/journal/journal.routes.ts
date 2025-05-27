import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';

export const journalRoutes: Routes = [
    {
    path: 'journal',
    loadComponent: () => import('./journal/journal.component').then(m => m.JournalComponent),
    canActivate: [AuthGuard],
    },
    {
    path: 'journal/add',
    loadComponent: () =>
        import('./journal-entry-add/journal-entry-add.component').then(m => m.JournalEntryAddComponent),
    canActivate: [AuthGuard]
    },
    {
    path: 'journal/edit/:id',
    loadComponent: () =>
        import('./journal-entry-edit/journal-entry-edit.component').then(m => m.JournalEntryEditComponent),
    canActivate: [AuthGuard]
    },
];