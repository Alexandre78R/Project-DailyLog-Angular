import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  instanceId = Math.random();
  serverError: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor() {
    console.log('LoginComponent constructor called');
        console.log('LoginComponent constructor called',  Math.random());
  }

  ngOnInit() {
    console.log('LoginComponent ngOnInit called');
  }

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue() as { email: string; password: string };

    this.serverError = null;

    this.auth.login({ email, password }).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.log('Erreur côté client reçue:', err);
        this.serverError = err.message || 'Une erreur inconnue est survenue.';
      }
    });
  }
}