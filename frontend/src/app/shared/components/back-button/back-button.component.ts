import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a
      [routerLink]="routerLink"
      class="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition font-medium"
    >
      <span class="text-xl">⬅️</span>
      <span class="text-sm">{{ label }}</span>
    </a>
  `,
})
export class BackButtonComponent {
  @Input() label = 'Retour';
  @Input() routerLink: string | any[] = '/';
}