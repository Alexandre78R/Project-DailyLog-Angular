import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { StatsService } from './stats.service';
import { of } from 'rxjs';
import { MoodPieChartComponent } from './mood-chart/mood-pie-chart/mood-pie-chart.component';
import { MoodLineChartComponent } from './mood-chart/mood-line-chart/mood-line-chart.component';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let statsServiceMock: jasmine.SpyObj<StatsService>;

  const mockMonthlyStats = [
    {
      month: '2025-06',
      moods: { happy: 5, sad: 3 },
      totalEntries: 8
    }
  ];

  const mockDailyStats = [
    { date: '2025-06-01', moods: { happy: 1, sad: 0, neutral: 0 } },
    { date: '2025-06-02', moods: { happy: 0, sad: 1, neutral: 0 } },
    { date: '2025-06-03', moods: { happy: 1, sad: 0, neutral: 0 } }
  ];

  beforeEach(waitForAsync(() => {
    statsServiceMock = jasmine.createSpyObj('StatsService', ['getMoodStats', 'getDailyMoodStats']);

    TestBed.configureTestingModule({
      imports: [
        StatsComponent,
        MoodPieChartComponent,
        MoodLineChartComponent,
        CommonModule
      ],
      providers: [
        { provide: StatsService, useValue: statsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    statsServiceMock.getMoodStats.and.returnValue(
      of({
        userId: 1,
        moodStats: mockMonthlyStats
      })
    );

    statsServiceMock.getDailyMoodStats.and.returnValue(of(mockDailyStats));

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats and update the view', () => {
    expect(component.moodStats.length).toBe(1);
    expect(component.dailyMoodStats.length).toBe(3);
    expect(component.currentMoods).toEqual({ happy: 5, sad: 3 });
  });

  it('should display the mood charts when data is available', () => {
    fixture.detectChanges();

    const pieChart = fixture.debugElement.query(By.css('app-mood-pie-chart'));
    const lineChart = fixture.debugElement.query(By.css('app-mood-line-chart'));

    expect(pieChart).toBeTruthy();
    expect(lineChart).toBeTruthy();
  });

  it('should show fallback message when no data is available', () => {
    statsServiceMock.getMoodStats.and.returnValue(of({
      userId: 1,
      moodStats: []
    }));
    statsServiceMock.getDailyMoodStats.and.returnValue(of([]));

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const message = fixture.debugElement.query(By.css('p'));
    expect(message.nativeElement.textContent).toContain('Aucune donnée disponible');
  });
});