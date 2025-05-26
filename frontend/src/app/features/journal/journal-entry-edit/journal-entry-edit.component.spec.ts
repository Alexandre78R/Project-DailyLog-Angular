import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalEntryEditComponent } from './journal-entry-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('JournalEntryEditComponent', () => {
  let component: JournalEntryEditComponent;
  let fixture: ComponentFixture<JournalEntryEditComponent>;
  let journalServiceSpy: jasmine.SpyObj<any>;
  let router: Router;
  let activatedRouteMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      snapshot: { paramMap: { get: (_: string) => '123' } },
      params: of({ id: '123' })
    };

    journalServiceSpy = jasmine.createSpyObj('JournalService', ['getEntry', 'updateEntry']);

    await TestBed.configureTestingModule({
      imports: [
        JournalEntryEditComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: FormBuilder, useClass: FormBuilder },
        { provide: 'JournalService', useValue: journalServiceSpy },
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(JournalEntryEditComponent);
    component = fixture.componentInstance;

    // Réinjecte manuellement dans le standalone component
    component['journalService'] = journalServiceSpy;
    component['fb'] = new FormBuilder();
    component['router'] = router;
  });

  it('should create', () => {
    journalServiceSpy.getEntry.and.returnValue(of({
      date: '2025-05-26',
      title: 'Titre',
      content: 'Contenu',
      mood: 'happy'
    }));
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should have entryId from route param', () => {
    journalServiceSpy.getEntry.and.returnValue(of({
      date: '', title: '', content: '', mood: ''
    }));
    component.ngOnInit();
    expect(component.entryId).toBe(123);
  });

  it('should patch form with entry data on init', () => {
    const fakeEntry = {
      date: '2020-01-01',
      title: 'Ma entrée',
      content: 'Mon contenu',
      mood: 'neutral'
    };
    journalServiceSpy.getEntry.and.returnValue(of(fakeEntry));

    component.ngOnInit();
    expect(component.form.value).toEqual(fakeEntry);
    expect(component.entryId).toBe(123);
  });

  it('should navigate to /journal if entry not found', () => {
    journalServiceSpy.getEntry.and.returnValue(of(null));
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/journal']);
  });

  it('should navigate to /journal if getEntry errors', () => {
    journalServiceSpy.getEntry.and.returnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/journal']);
  });

  it('should navigate away after successful update', () => {
    journalServiceSpy.getEntry.and.returnValue(of({
      date: '', title: '', content: '', mood: ''
    }));
    journalServiceSpy.updateEntry.and.returnValue(of({}));

    component.ngOnInit();
    component.form.setValue({
      date: '2025-05-26',
      title: 'Titre modifié',
      content: 'Contenu modifié',
      mood: 'sad'
    });
    component.onSubmit();

    expect(journalServiceSpy.updateEntry)
      .toHaveBeenCalledWith(123, component.form.value);
    expect(router.navigate).toHaveBeenCalledWith(['/journal']);
  });

  it('should log error if updateEntry fails', () => {
    journalServiceSpy.getEntry.and.returnValue(of({
      date: '', title: '', content: '', mood: ''
    }));
    const err = new Error('update failed');
    journalServiceSpy.updateEntry.and.returnValue(throwError(() => err));
    spyOn(console, 'error');

    component.ngOnInit();
    component.form.setValue({
      date: '2025-05-26',
      title: 'Titre modifié',
      content: 'Contenu modifié',
      mood: 'happy'
    });
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de la mise à jour', err);
  });

  it('should navigate to /journal if param id is invalid', () => {
    activatedRouteMock.snapshot.paramMap.get = (_: string) => 'invalid';
    journalServiceSpy.getEntry.and.returnValue(of({ date: '', title: '', content: '', mood: '' }));

    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/journal']);
  });
});