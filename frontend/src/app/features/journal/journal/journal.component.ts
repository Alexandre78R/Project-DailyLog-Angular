import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalEntryListComponent } from '../journal-entry-list/journal-entry-list.component';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, JournalEntryListComponent],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent {}