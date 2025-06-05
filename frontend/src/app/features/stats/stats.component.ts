import { Component, OnInit } from '@angular/core';
import { StatsService } from './stats.service';
import { MoodLineChartComponent } from './mood-chart/mood-line-chart/mood-line-chart.component';
import { MoodPieChartComponent } from './mood-chart/mood-pie-chart/mood-pie-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [MoodPieChartComponent, MoodLineChartComponent, CommonModule],
  templateUrl: './stats.component.html',
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
