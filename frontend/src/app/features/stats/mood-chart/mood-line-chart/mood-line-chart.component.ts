import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-mood-line-chart',
  standalone: true,
  template: `<canvas #lineCanvas></canvas>`,
})
export class MoodLineChartComponent implements AfterViewInit, OnChanges {
  @Input() moodStats: { date: string; moods: Record<string, number> }[] = [];
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart<'line'> | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && changes['moodStats']) {
      this.updateChart();
    }
  }

  private getColor(mood: string): string {
    switch (mood) {
      case 'happy': return 'green';
      case 'neutral': return 'gray';
      case 'sad': return 'red';
      default: return 'blue';
    }
  }

  private getChartData() {
    if (!this.moodStats.length) {
      return { labels: [], datasets: [] };
    }

    const sortedStats = [...this.moodStats].sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    const allDates = sortedStats.map((s) => s.date);

    const moodTypes = new Set<string>();
    sortedStats.forEach((s) =>
      Object.keys(s.moods).forEach((mood) => moodTypes.add(mood))
    );

    const datasets = Array.from(moodTypes).map((mood) => ({
      label: mood,
      data: allDates.map((date) => {
        const entry = sortedStats.find((s) => s.date === date);
        return entry?.moods[mood] ?? 0;
      }),
      fill: false,
      borderColor: this.getColor(mood),
      backgroundColor: this.getColor(mood),
      tension: 0.2,
    }));

    return {
      labels: allDates,
      datasets,
    };
  }

  private createChart() {
    const ctx = this.lineCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.getChartData(),
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: {
            title: { display: true, text: 'Date' },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 14,
            },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Occurrences' },
          },
        },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    this.chart.data = this.getChartData();
    this.chart.update();
  }
}