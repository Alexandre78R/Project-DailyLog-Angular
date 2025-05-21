import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = 'http://localhost:3001/api/auth';

  token = signal<string | null>(null);

  constructor() {
    if (this.isBrowser()) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token.set(storedToken);
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem('token', res.token);
        }
        this.token.set(res.token);
      })
    );
  }

  register(data: { email: string; password: string; name: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.token.set(null);
  }

  isAuthenticated() {
    return !!this.token();
  }

  getToken(): string | null {
    return this.token();
  }
}