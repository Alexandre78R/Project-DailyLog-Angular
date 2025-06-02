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

      <h2>Évolution mensuelle</h2>
      <app-mood-line-chart [moodStats]="moodStats"></app-mood-line-chart>
    </div>
    <div *ngIf="!moodStats?.length">
      <p>Aucune donnée disponible</p>
    </div>
  `
})
export class StatsComponent implements OnInit {
  moodStats: { month: string; moods: Record<string, number>; totalEntries: number }[] = [];
  currentMonth = '';
  currentMoods: Record<string, number> = {};

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    const userId = 1; // à remplacer par user connecté
    this.statsService.getMoodStats(userId).subscribe(res => {
      this.moodStats = res.moodStats;
      if (this.moodStats.length) {
        this.currentMonth = this.moodStats[0].month;
        this.currentMoods = this.moodStats[0].moods;
      }
    });
  }
}