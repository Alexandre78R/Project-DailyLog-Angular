import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface MoodStatsMonth {
  month: string;
  totalEntries: number;
  moods: Record<string, number>;
}

interface MoodStatsResponse {
  userId: number;
  moodStats: MoodStatsMonth[];
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMoodStats(userId: number): Observable<MoodStatsResponse> {
    const token = localStorage.getItem('token');
    return this.http.get<MoodStatsResponse>(`${this.apiUrl}/mood_stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}