import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryEditComponent } from './journal-entry-edit.component';

describe('JournalEntryEditComponent', () => {
  let component: JournalEntryEditComponent;
  let fixture: ComponentFixture<JournalEntryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
