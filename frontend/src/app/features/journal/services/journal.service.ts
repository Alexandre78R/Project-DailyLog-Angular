import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Entry {
  id: number;
  userId: number;
  date: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiUrl = `${environment.apiUrl}/entries`;

  constructor(private http: HttpClient) {}

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiUrl);
  }

  getUserEntries(limit = 10, page = 1): Observable<{ entries: Entry[]; total: number; page: number; totalPages: number }> {
    const token = localStorage.getItem('token');

    return this.http.get<{ entries: Entry[]; total: number; page: number; totalPages: number }>(
      `${this.apiUrl}/user?limit=${limit}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  addEntry(entry: Partial<Entry>): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(`${this.apiUrl}`, entry, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
