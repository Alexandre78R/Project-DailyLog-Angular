import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

interface User {
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  token = signal<string | null>(null);
  private loggedIn$: BehaviorSubject<boolean>;

  constructor() {
    if (this.isBrowser()) {
      this.loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        this.token.set(storedToken);

        this.getUserFromToken().subscribe(user => {
          this._user.next(user);
        });
      }
    } else {
      this.loggedIn$ = new BehaviorSubject<boolean>(false);
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private hasToken(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }

  private getUserFromToken(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return of(null);

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return this.http.get<User>(`${this.apiUrl}/users/name/${payload.id}`);
    } catch {
      return of(null);
    }
  }

  isLoggedIn$() {
    return this.loggedIn$.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string, userId: number }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem('token', res.token);
          this.token.set(res.token);
          this.loggedIn$.next(true);
        }

        this.getUserFromToken().subscribe(user => {
          this._user.next(user);
        });
      }),
      catchError((error) => throwError(() => this.formatError(error)))
    );
  }

  register(data: { email: string; password: string; name: string; confirmPassword?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      catchError((error) => throwError(() => this.formatError(error)))
    );
  }

  private formatError(error: any): { message: string } {
    if (error?.error?.message) {
      return { message: error.error.message };
    }

    if (error.status === 0) {
      return { message: 'Impossible de contacter le serveur.' };
    }

    return { message: 'Une erreur inconnue est survenue.' };
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.loggedIn$.next(false);
    this.token.set(null);
    this._user.next(null);
  }

  setUser(user: User | null) {
    this._user.next(user);
  }

  isAuthenticated() {
    return !!this.token();
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;

    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp && exp > now;
    } catch (e) {
      return false;
    }
  }

  getToken(): string | null {
    return this.token();
  }
}