import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { LogoutButtonComponent } from '../../auth/logout-button/logout-button.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-journal-entry',
  standalone: true,
  imports: [LogoutButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.css']
})
export class JournalEntryComponent {
  isLoggedIn$!: ReturnType<AuthService['isLoggedIn$']>;
  journalForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn$();

    this.journalForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      mood: ['neutral', Validators.required],
      date: [new Date().toISOString()]
    });
  }

  onSubmit() {
    if (this.journalForm.valid) {
      console.log('Form submitted', this.journalForm.value);
    }
  }
}