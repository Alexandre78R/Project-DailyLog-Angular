import { Component, OnInit } from '@angular/core';
import { StatsService } from './stats.service';
import { MoodLineChartComponent } from './mood-chart/mood-line-chart/mood-line-chart.component';
import { MoodPieChartComponent } from './mood-chart/mood-pie-chart/mood-pie-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MoodPieChartComponent, MoodLineChartComponent, CommonModule],
  template: `
    <h1>Statistiques d'humeur</h1>

    <div *ngIf="moodStats?.length">
      <h2>Résumé du mois : {{ currentMonth }}</h2>
      <app-mood-pie-chart [moods]="currentMoods"></app-mood-pie-chart>
    </div>

    <div *ngIf="dailyMoodStats?.length">
      <h2>Évolution journalière</h2>
      <app-mood-line-chart [moodStats]="dailyMoodStats"></app-mood-line-chart>
    </div>

    <div *ngIf="!dailyMoodStats?.length">
      <p>Aucune donnée disponible</p>
    </div>
  `
})
export class StatsComponent implements OnInit {
  moodStats: { month: string; moods: Record<string, number>; totalEntries: number }[] = [];
  dailyMoodStats: { date: string; moods: Record<string, number> }[] = [];
  currentMonth = '';
  currentMoods: Record<string, number> = {};

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getMoodStats().subscribe(res => {
      this.moodStats = res.moodStats;
      if (this.moodStats.length) {
        this.currentMonth = this.moodStats[0].month;
        this.currentMoods = this.moodStats[0].moods;
      }
    });

    this.statsService.getDailyMoodStats().subscribe(res => {
      this.dailyMoodStats = res;
    });
  }
}