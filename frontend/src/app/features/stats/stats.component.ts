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
  <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
    <h1 class="text-3xl font-bold">Statistiques d'humeur</h1>

    <div>
      <label for="monthPicker" class="mr-2 font-medium">Choisir un mois :</label>
      <input
        id="monthPicker"
        type="month"
        class="border rounded px-3 py-1"
        [value]="currentMonth"
        (change)="handleMonthChange($event)"
      />
    </div>
  </div>

  <div *ngIf="moodStats && currentMoods && dailyMoodStats.length" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="order-2 lg:order-1">
      <h2 class="text-xl font-semibold mb-2">Résumé du mois : {{ currentMonth }}</h2>
      <app-mood-pie-chart [moods]="currentMoods"></app-mood-pie-chart>
    </div>

    <div class="order-1 lg:order-2">
      <h2 class="text-xl font-semibold mb-2">Évolution journalière</h2>
      <app-mood-line-chart [moodStats]="dailyMoodStats"></app-mood-line-chart>
    </div>
  </div>

  <div *ngIf="!dailyMoodStats.length || !currentMoods" class="text-center mt-10">
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
    const now = new Date();
    this.currentMonth = now.toISOString().slice(0, 7);
    this.loadStats(this.currentMonth);
  }

  handleMonthChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const selectedMonth = target.value;
    this.currentMonth = selectedMonth;
    this.loadStats(selectedMonth);
  }

  private loadStats(month: string) {
    this.statsService.getMoodStats(month).subscribe(res => {
      this.moodStats = res.moodStats;
      const stat = this.moodStats.find(m => m.month === month);
      this.currentMoods = stat?.moods ?? {};
    });

    this.statsService.getDailyMoodStats(month).subscribe(res => {
      this.dailyMoodStats = res;
    });
  }
}
