import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../services/journal.service';
import { NoteCardComponent } from '../../../shared/components/note-card/note-card.component';
import { MoodIndicatorComponent } from '../../../shared/components/mood-indicator/mood-indicator.component';
@Component({
  selector: 'app-journal-entry-list',
  standalone: true,
  imports: [CommonModule, NoteCardComponent, MoodIndicatorComponent],
  templateUrl: './journal-entry-list.component.html',
  styleUrls: ['./journal-entry-list.component.css']
})
export class JournalEntryListComponent implements OnInit {
  entries: any[] = [];

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.journalService.getUserEntries(10, 1).subscribe({
      next: (data) => {
        this.entries = data.entries; 
      },
      error: (err) => console.error('Erreur lors du chargement des entrées :', err)
    });
  }
}
