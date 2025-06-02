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
  <section class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">Statistiques d'humeur</h1>
  </section>

  <div *ngIf="moodStats?.length && dailyMoodStats?.length" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Colonne droite (affichée en premier visuellement grâce à row-reverse) -->
    <div class="order-2 lg:order-1">
      <h2 class="text-xl font-semibold mb-2">Résumé du mois : {{ currentMonth }}</h2>
      <app-mood-pie-chart [moods]="currentMoods"></app-mood-pie-chart>
    </div>

    <!-- Colonne gauche (affichée en second mais à droite visuellement) -->
    <div class="order-1 lg:order-2">
      <h2 class="text-xl font-semibold mb-2">Évolution journalière</h2>
      <app-mood-line-chart [moodStats]="dailyMoodStats"></app-mood-line-chart>
    </div>
  </div>

  <div *ngIf="!dailyMoodStats?.length || !moodStats?.length" class="text-center mt-10">
    <p class="text-gray-500">Aucune donnée disponible</p>
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