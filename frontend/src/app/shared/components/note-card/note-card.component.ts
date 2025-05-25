import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoodIndicatorComponent } from '../mood-indicator/mood-indicator.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MoodIndicatorComponent, TruncatePipe],
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

  onDeleteClick() {
    if (confirm('Supprimer cette entrée ?')) {
      this.delete.emit(this.id);
    }
  }
}