import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodIndicatorComponent } from './mood-indicator.component';

describe('MoodIndicatorComponent', () => {
  let component: MoodIndicatorComponent;
  let fixture: ComponentFixture<MoodIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodIndicatorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoodIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
