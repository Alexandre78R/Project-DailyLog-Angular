import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalEntryDeleteComponent } from './journal-entry-delete.component';
import { JournalService } from '../services/journal.service';
import { of, throwError } from 'rxjs';

describe('JournalEntryDeleteComponent', () => {
  let component: JournalEntryDeleteComponent;
  let fixture: ComponentFixture<JournalEntryDeleteComponent>;
  let journalServiceSpy: jasmine.SpyObj<JournalService>;

  beforeEach(async () => {
    journalServiceSpy = jasmine.createSpyObj('JournalService', ['deleteEntry']);

    await TestBed.configureTestingModule({
      imports: [JournalEntryDeleteComponent],
      providers: [{ provide: JournalService, useValue: journalServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalEntryDeleteComponent);
    component = fixture.componentInstance;
    component.entryId = 42; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call deleteEntry if confirmation is canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.delete();
    expect(journalServiceSpy.deleteEntry).not.toHaveBeenCalled();
  });

  it('should call deleteEntry and emit deleted if confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    journalServiceSpy.deleteEntry.and.returnValue(of({}));
    spyOn(component.deleted, 'emit');

    component.delete();

    expect(journalServiceSpy.deleteEntry).toHaveBeenCalledWith(42);
 
    expect(component.deleted.emit).toHaveBeenCalled();
  });

  it('should log error if deleteEntry fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const error = 'Delete failed';
    journalServiceSpy.deleteEntry.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.delete();

    expect(journalServiceSpy.deleteEntry).toHaveBeenCalledWith(42);
    expect(console.error).toHaveBeenCalledWith('Erreur de suppression :', error);
  });
});