import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/api/auth';

  token = signal<string | null>(localStorage.getItem('token'));

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.token.set(res.token);
      })
    );
  }

  register(data: { email: string; password: string; name: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isAuthenticated() {
    return !!this.token();
  }
}