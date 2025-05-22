import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { name, email, password } = this.form.value;

    this.auth.register({
      name: name!,
      email: email!,
      password: password!,
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err: { error: { message: any; }; }) =>
        alert('Erreur : ' + (err.error?.message || 'Une erreur est survenue')),
    });
  }
}