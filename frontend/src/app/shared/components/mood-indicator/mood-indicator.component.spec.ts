import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodIndicatorComponent } from './mood-indicator.component';
import { By } from '@angular/platform-browser';

describe('MoodIndicatorComponent', () => {
  let component: MoodIndicatorComponent;
  let fixture: ComponentFixture<MoodIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoodIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct emoji for "happy" 😊 mood', () => {
    component.mood = 'happy';
    expect(component.emoji).toBe('😊');
  });

  it('should return correct emoji for "sad" 😢 mood', () => {
    component.mood = 'sad';
    expect(component.emoji).toBe('😢');
  });

  it('should return correct emoji for "neutral" 😐 mood', () => {
    component.mood = 'neutral';
    expect(component.emoji).toBe('😐');
  });

  it('should return "❓" emoji for unknown mood', () => {
    component.mood = 'angry';
    expect(component.emoji).toBe('❓');
  });

  it('should return correct color class for "sad" mood', () => {
    component.mood = 'sad';
    expect(component.color).toBe('text-blue-500');
  });

  it('should return correct color class for "neutral" mood', () => {
    component.mood = 'neutral';
    expect(component.color).toBe('text-gray-500');
  });

  it('should return default color class for "happy" mood', () => {
    component.mood = 'happy';
    expect(component.color).toBe('text-yellow-500');
  });

  it('should return default color class for unknown mood', () => {
    component.mood = 'excited';
    expect(component.color).toBe('text-yellow-500');
  });
});