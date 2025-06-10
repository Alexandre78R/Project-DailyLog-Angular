import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../services/journal.service';
import { NoteCardComponent } from '../../../shared/components/note-card/note-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-journal-entry-list',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, PaginationComponent],
  templateUrl: './journal-entry-list.component.html',
})
export class JournalEntryListComponent implements OnInit {
  entries: any[] = [];
  currentPage = 1;
  totalPages = 1;

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.fetchEntries();
  }

  fetchEntries(page: number = 1): void {
    this.journalService.getUserEntries(6, page).subscribe({
      next: (data) => {
        this.entries = data.entries;
        this.currentPage = data.page;
        this.totalPages = data.totalPages;
      },
      error: (err) => console.error('Erreur lors du chargement des entrées :', err)
    });
  }

  onPageChange(page: number): void {
    this.fetchEntries(page);
  }
  
  onDeleteEntry(id: number) {
    this.journalService.deleteEntry(id).subscribe({
      next: () => {
        this.entries = this.entries.filter(entry => entry.id !== id);
      },
      error: err => console.error('Erreur suppression :', err)
    });
  }
}
