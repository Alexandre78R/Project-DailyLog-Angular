import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodIndicatorComponent } from '../mood-indicator/mood-indicator.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MoodIndicatorComponent, TruncatePipe, ConfirmModalComponent, RouterModule
  ],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css'],
})

export class NoteCardComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() content!: string;
  @Input() date!: string;
  @Input() mood!: 'happy' | 'neutral' | 'sad';

  @Output() delete = new EventEmitter<number>();
  
  showModal = false;

  confirmDelete() {
    this.delete.emit(this.id);
    this.showModal = false;
  }
}