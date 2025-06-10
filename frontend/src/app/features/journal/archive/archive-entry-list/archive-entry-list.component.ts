import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { NoteCardComponent } from '../../../../shared/components/note-card/note-card.component';
import { MoodIndicatorComponent } from '../../../../shared/components/mood-indicator/mood-indicator.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad';
  date: string;
}

@Component({
  selector: 'app-archive-entry-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NoteCardComponent,
    MoodIndicatorComponent,
    PaginationComponent
  ],
  templateUrl: './archive-entry-list.component.html',
})
export class ArchiveEntryListComponent implements OnInit {
  entries: JournalEntry[] = [];

  searchTerm: string = '';
  moodFilter: string = '';
  startDate: string = '';
  endDate: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  readonly limit: number = 6;

  constructor(private readonly journalService: JournalService) {}

  ngOnInit(): void {
    this.loadEntries();
  }

loadEntries(): void {
  const fromDateISO = this.startDate
    ? new Date(this.startDate + 'T00:00:00.000Z').toISOString()
    : undefined;

  const toDateISO = this.endDate
    ? new Date(this.endDate + 'T23:59:59.999Z').toISOString()
    : undefined;

  const filters = {
    page: this.currentPage,
    limit: this.limit,
    search: this.searchTerm.trim() || undefined,
    mood: this.moodFilter || undefined,
    fromDate: fromDateISO,
    toDate: toDateISO
  };

  this.journalService.getUserEntriesFiltered(filters).subscribe({
    next: (data) => {
      this.entries = data.entries.map((entry: any) => ({
        ...entry,
        mood: ['happy', 'neutral', 'sad'].includes(entry.mood) ? entry.mood : 'neutral'
      }));
      this.totalPages = data.totalPages;
    },
    error: (err) => {
      console.error('Erreur lors du chargement des entrées :', err);
    }
  });
}

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEntries();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEntries();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.moodFilter = '';
    this.startDate = '';
    this.endDate = '';
    this.currentPage = 1;
    this.loadEntries();
  }
}