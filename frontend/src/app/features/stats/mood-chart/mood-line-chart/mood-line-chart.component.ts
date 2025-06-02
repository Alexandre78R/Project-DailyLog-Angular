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
  @Input() moodStats: { month: string; moods: Record<string, number> }[] = [];
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
      case 'happy':
        return 'green';
      case 'neutral':
        return 'gray';
      case 'sad':
        return 'red';
      default:
        return 'blue';
    }
  }

  private getChartData() {
    if (!this.moodStats.length) {
      return { labels: [], datasets: [] };
    }

    const months = this.moodStats.map((s) => s.month).sort();

    const allMoods = new Set<string>();
    this.moodStats.forEach((s) =>
      Object.keys(s.moods).forEach((m) => allMoods.add(m))
    );

    const datasets = Array.from(allMoods).map((mood) => ({
      label: mood,
      data: months.map((month) => {
        const stat = this.moodStats.find((s) => s.month === month);
        return stat?.moods[mood] ?? 0;
      }),
      fill: false,
      borderColor: this.getColor(mood),
      tension: 0.1,
      backgroundColor: this.getColor(mood),
    }));

    return {
      labels: months,
      datasets,
    };
  }

  private createChart() {
    if (!this.lineCanvas) return;
    const ctx = this.lineCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: this.getChartData(),
      options: {
        responsive: true,
        scales: {
          x: {},
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { position: 'top' },
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