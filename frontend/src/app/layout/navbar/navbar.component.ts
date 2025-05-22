import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import angular directives
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,   // si tu utilises standalone components
  imports: [CommonModule],  // <-- Ajoute ici CommonModule pour ngIf etc.
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.name || null;
      console.log('Username:', this.username);
    });
  }

  logout() {
    this.authService.logout();
  }
}