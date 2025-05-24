import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryDeleteComponent } from './journal-entry-delete.component';

describe('JournalEntryDeleteComponent', () => {
  let component: JournalEntryDeleteComponent;
  let fixture: ComponentFixture<JournalEntryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntryDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
