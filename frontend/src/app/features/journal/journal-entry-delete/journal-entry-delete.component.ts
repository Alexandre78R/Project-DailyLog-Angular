import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalService } from '../services/journal.service';

@Component({
  selector: 'app-journal-entry-delete',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="delete()" class="text-red-600 hover:text-red-800 transition">🗑 Supprimer</button>
  `,
})
export class JournalEntryDeleteComponent {
  @Input() entryId!: number;
  @Output() deleted = new EventEmitter<void>();

  constructor(private journalService: JournalService) {}

  delete() {
    if (confirm("Es-tu sûr de vouloir supprimer cette entrée ?")) {
      this.journalService.deleteEntry(this.entryId).subscribe({
        next: () => this.deleted.emit(),
        error: err => console.error('Erreur de suppression :', err)
      });
    }
  }
}