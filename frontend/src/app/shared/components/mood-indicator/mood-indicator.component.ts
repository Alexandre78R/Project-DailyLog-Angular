import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mood-indicator',
  standalone: true,
  templateUrl: './mood-indicator.component.html',
})
export class MoodIndicatorComponent {
  @Input() mood: 'happy' | 'neutral' | 'sad' = 'neutral';

  get emoji(): string {
    switch (this.mood) {
      case 'happy':
        return '😀';
      case 'sad':
        return '😔';
      default:
        return '😐';
    }
  }

  get color(): string {
    switch (this.mood) {
      case 'happy':
        return 'text-yellow-400';
      case 'sad':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }
}