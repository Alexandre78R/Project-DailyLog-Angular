import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || null;
    });
  }

  logout() {
    this.authService.logout();
  }
}