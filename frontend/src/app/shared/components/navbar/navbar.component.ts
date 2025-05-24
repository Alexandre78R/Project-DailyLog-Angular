import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    });
  }

  logout() {
    this.authService.logout();
  }
}