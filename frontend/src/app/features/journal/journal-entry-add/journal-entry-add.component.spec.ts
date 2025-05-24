import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryAddComponent } from './journal-entry-add.component';

describe('JournalEntryAddComponent', () => {
  let component: JournalEntryAddComponent;
  let fixture: ComponentFixture<JournalEntryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntryAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
