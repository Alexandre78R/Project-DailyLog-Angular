import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="logout()">Se déconnecter</button>
  `
})
export class LogoutButtonComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoggedIn = false;

  constructor() {
    this.auth.isLoggedIn$().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}