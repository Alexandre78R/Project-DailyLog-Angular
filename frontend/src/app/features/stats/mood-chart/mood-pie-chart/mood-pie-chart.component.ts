import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-mood-pie-chart',
  standalone: true,
  template: `<canvas #pieCanvas></canvas>`,
})
export class MoodPieChartComponent implements AfterViewInit, OnChanges {
  @Input() moods: Record<string, number> = {};
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  private chart: Chart<'pie'> | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && changes['moods']) {
      this.updateChart();
    }
  }

  private getChartData() {
    return {
      labels: Object.keys(this.moods),
      datasets: [
        {
          label: 'Répartition des humeurs',
          data: Object.values(this.moods),
          backgroundColor: [
            '#f87171',
            '#fbbf24',
            '#34d399',
            '#60a5fa',
            '#a78bfa',
            '#f472b6',
          ],
        },
      ],
    };
  }

  private createChart() {
    if (!this.pieCanvas) return;
    const ctx = this.pieCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: this.getChartData(),
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
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