import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { LogoutButtonComponent } from '../../auth/logout-button/logout-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journal-entry',
  imports: [LogoutButtonComponent, CommonModule],
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss']
})
export class JournalEntryComponent {

  isLoggedIn$!: ReturnType<AuthService['isLoggedIn$']>;  // propriété non initialisée ici

  constructor(private auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$(); // initialisation dans le constructeur, après injection
  }
}