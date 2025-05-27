import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';  // <-- Import Observable ici
import { JournalEntryListComponent } from './journal-entry-list.component';
import { JournalService } from '../services/journal.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

interface Entry {
  id: number;
  userId: number;
  date: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

describe('JournalEntryListComponent', () => {
  let component: JournalEntryListComponent;
  let fixture: ComponentFixture<JournalEntryListComponent>;
  let journalServiceSpy: jasmine.SpyObj<JournalService>;

  beforeEach(async () => {
    journalServiceSpy = jasmine.createSpyObj('JournalService', ['getUserEntries', 'deleteEntry']);

    await TestBed.configureTestingModule({
      imports: [
        JournalEntryListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: JournalService, useValue: journalServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalEntryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entries on init', () => {
    const mockEntries: Entry[] = [
      {
        id: 1,
        userId: 10,
        date: '2025-05-26T10:00:00Z',
        title: 'Test 1',
        content: 'Contenu 1',
        mood: 'happy',
        createdAt: '2025-05-26T09:00:00Z'
      },
      {
        id: 2,
        userId: 10,
        date: '2025-05-25T10:00:00Z',
        title: 'Test 2',
        content: 'Contenu 2',
        mood: 'neutral',
        createdAt: '2025-05-25T09:00:00Z'
      }
    ];

    journalServiceSpy.getUserEntries.and.returnValue(of({
      entries: mockEntries,
      total: 2,
      page: 1,
      totalPages: 1
    }));

    component.ngOnInit();

    expect(journalServiceSpy.getUserEntries).toHaveBeenCalledWith(6, 1);
    expect(component.entries.length).toBe(2);
    expect(component.entries).toEqual(mockEntries);
  });

  it('should remove an entry on delete', () => {
    component.entries = [
      {
        id: 1,
        userId: 10,
        date: '2025-05-26T10:00:00Z',
        title: 'Entry 1',
        content: 'Content 1',
        mood: 'happy',
        createdAt: '2025-05-26T09:00:00Z'
      },
      {
        id: 2,
        userId: 10,
        date: '2025-05-25T10:00:00Z',
        title: 'Entry 2',
        content: 'Content 2',
        mood: 'neutral',
        createdAt: '2025-05-25T09:00:00Z'
      }
    ];

    journalServiceSpy.deleteEntry.and.returnValue(of({}));

    component.onDeleteEntry(1);

    expect(journalServiceSpy.deleteEntry).toHaveBeenCalledWith(1);
    expect(component.entries.length).toBe(1);
    expect(component.entries[0].id).toBe(2);
  });

  it('should handle delete error gracefully', () => {
    spyOn(console, 'error');
    journalServiceSpy.deleteEntry.and.returnValue(
      new Observable(observer => {
        observer.error('Delete failed');
      })
    );

    component.entries = [{
      id: 1,
      userId: 10,
      date: '2025-05-26T10:00:00Z',
      title: 'Entry 1',
      content: 'Content 1',
      mood: 'happy',
      createdAt: '2025-05-26T09:00:00Z'
    }];

    component.onDeleteEntry(1);

    expect(journalServiceSpy.deleteEntry).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('Erreur suppression :', 'Delete failed');
    expect(component.entries.length).toBe(1);
  });
});