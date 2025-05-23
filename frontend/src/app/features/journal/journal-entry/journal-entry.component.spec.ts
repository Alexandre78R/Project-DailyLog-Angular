import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalEntryComponent } from './journal-entry.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JournalEntryComponent', () => {
  let component: JournalEntryComponent;
  let fixture: ComponentFixture<JournalEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntryComponent, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
