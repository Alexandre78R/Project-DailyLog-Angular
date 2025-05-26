import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalEntryAddComponent } from './journal-entry-add.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { JournalService } from '../services/journal.service';

describe('JournalEntryAddComponent', () => {
  let component: JournalEntryAddComponent;
  let fixture: ComponentFixture<JournalEntryAddComponent>;
  let journalService: JournalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntryAddComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: {
                get: (key: string) => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JournalEntryAddComponent);
    component = fixture.componentInstance;
    journalService = TestBed.inject(JournalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid when filled properly', () => {
    component.form.controls['title'].setValue('Mon titre');
    component.form.controls['content'].setValue('Le contenu de mon journal');
    component.form.controls['mood'].setValue('happy');

    expect(component.form.valid).toBeTruthy();
  });

  it('should call addEntry on submit when form is valid', () => {
    const spy = spyOn(journalService, 'addEntry').and.returnValue(of({}));

    component.form.controls['title'].setValue('Mon titre');
    component.form.controls['content'].setValue('Le contenu de mon journal');
    component.form.controls['mood'].setValue('happy');

    component.onSubmit();

    expect(spy).toHaveBeenCalled();

    const calledWith = spy.calls.mostRecent().args[0];
    expect(calledWith.title).toBe('Mon titre');
    expect(calledWith.content).toBe('Le contenu de mon journal');
    expect(calledWith.mood).toBe('happy');
    expect(calledWith.date).toBeDefined();
  });
});