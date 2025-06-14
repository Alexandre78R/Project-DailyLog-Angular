import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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

  getMoodStats(month: string): Observable<MoodStatsResponse> {
    const token = localStorage.getItem('token');
    return this.http.get<MoodStatsResponse>(`${this.apiUrl}/mood_stats?month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getDailyMoodStats(month: string): Observable<{ date: string; moods: Record<string, number> }[]> {
    const token = localStorage.getItem('token');
    return this.http.get<{ userId: number; moodStats: { date: string; moods: Record<string, number> }[] }>(
      `${this.apiUrl}/mood_stats/daily?month=${month}`, 
            {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response.moodStats)
    );
  }
}