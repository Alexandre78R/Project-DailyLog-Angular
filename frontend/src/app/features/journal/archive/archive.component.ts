import { Component } from '@angular/core';
import { ArchiveEntryListComponent } from './archive-entry-list/archive-entry-list.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule, ArchiveEntryListComponent, RouterModule],
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})

export class ArchiveComponent {}