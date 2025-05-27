import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

    getUserEntriesFiltered(options: {
    page?: number;
    limit?: number;
    search?: string;
    mood?: string;
    fromDate?: string;
    toDate?: string;
  }): Observable<{ entries: Entry[]; total: number; page: number; totalPages: number }> {
    const token = localStorage.getItem('token');

    let params = new HttpParams();
    if (options.page) params = params.set('page', options.page.toString());
    if (options.limit) params = params.set('limit', options.limit.toString());
    if (options.search) params = params.set('search', options.search);
    if (options.mood) params = params.set('mood', options.mood);
    if (options.fromDate) params = params.set('fromDate', options.fromDate);
    if (options.toDate) params = params.set('toDate', options.toDate);

    return this.http.get<{ entries: Entry[]; total: number; page: number; totalPages: number }>(
      `${this.apiUrl}/user/archive`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
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

  deleteEntry(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getEntry(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateEntry(id: number, updatedData: any) {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${this.apiUrl}/${id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
