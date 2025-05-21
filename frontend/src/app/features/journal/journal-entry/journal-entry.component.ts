import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-journal-entry',
  imports: [],
  templateUrl: './journal-entry.component.html',
  styleUrl: './journal-entry.component.scss'
})

export class JournalEntryComponent {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    console.log("this.auth.isLoggedIn()",this.auth.isLoggedIn())
    // if (!this.auth.isLoggedIn()) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    // return true;
  }
}
