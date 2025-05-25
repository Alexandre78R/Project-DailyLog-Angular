import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-mood-indicator',
  imports: [CommonModule],
  templateUrl: './mood-indicator.component.html',
  styleUrls: ['./mood-indicator.component.css']
})
export class MoodIndicatorComponent {
  @Input() mood!: string;

  get emoji(): string {
    switch (this.mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'neutral': return '😐';
      default: return '❓';
    }
  }

  get color(): string {
    switch (this.mood) {
      case 'sad': return 'text-blue-500';
      case 'neutral': return 'text-gray-500';
      default: return 'text-yellow-500';
    }
  }
}