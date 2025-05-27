import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ArchiveEntryListComponent } from './archive-entry-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JournalService } from '../../services/journal.service';
import { ActivatedRoute } from '@angular/router';


describe('ArchiveEntryListComponent', () => {
  let component: ArchiveEntryListComponent;
  let fixture: ComponentFixture<ArchiveEntryListComponent>;
  let journalServiceSpy: jasmine.SpyObj<JournalService>;

  const mockEntries = [
    {
      id: 1,
      title: 'Titre 1',
      content: 'Contenu 1',
      mood: 'happy',
      date: '2025-05-25T10:00:00Z',
      userId: 42,
      createdAt: '2025-05-25T10:00:00Z' // champs requis par `Entry`
    },
    {
      id: 2,
      title: 'Titre 2',
      content: 'Contenu 2',
      mood: 'neutral',
      date: '2025-05-24T10:00:00Z',
      userId: 42,
      createdAt: '2025-05-24T10:00:00Z'
    }
  ];

  beforeEach(async () => {
    journalServiceSpy = jasmine.createSpyObj('JournalService', ['getUserEntriesFiltered']);

    await TestBed.configureTestingModule({
      imports: [ArchiveEntryListComponent, HttpClientTestingModule],
      providers: [
        { provide: JournalService, useValue: journalServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: { get: () => null } }
          }
        },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArchiveEntryListComponent);
    component = fixture.componentInstance;

    journalServiceSpy.getUserEntriesFiltered.and.returnValue(of({
      entries: mockEntries,
      total: 2,
      page: 1,
      totalPages: 1
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entries on init', () => {
    expect(journalServiceSpy.getUserEntriesFiltered).toHaveBeenCalled();
    expect(component.entries.length).toBe(2);
    expect(component.entries[0].title).toBe('Titre 1');
  });

  it('should call loadEntries again on filter change', () => {
    journalServiceSpy.getUserEntriesFiltered.calls.reset();

    component.searchTerm = 'Test';
    component.onFilterChange();

    expect(journalServiceSpy.getUserEntriesFiltered).toHaveBeenCalled();
    expect(component.currentPage).toBe(1);
  });

  it('should call loadEntries again on page change', () => {
    journalServiceSpy.getUserEntriesFiltered.calls.reset();

    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(journalServiceSpy.getUserEntriesFiltered).toHaveBeenCalled();
  });

  it('should reset all filters', () => {
    component.searchTerm = 'test';
    component.moodFilter = 'happy';
    component.startDate = '2025-01-01';
    component.endDate = '2025-01-31';

    component.resetFilters();

    expect(component.searchTerm).toBe('');
    expect(component.moodFilter).toBe('');
    expect(component.startDate).toBe('');
    expect(component.endDate).toBe('');
    expect(component.currentPage).toBe(1);
    expect(journalServiceSpy.getUserEntriesFiltered).toHaveBeenCalled();
  });
});