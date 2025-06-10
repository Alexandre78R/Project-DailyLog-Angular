import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JournalService } from '../services/journal.service';
import { Router } from '@angular/router';
import { MoodIndicatorComponent } from '../../../shared/components/mood-indicator/mood-indicator.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-journal-entry-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MoodIndicatorComponent, BackButtonComponent ],
  templateUrl: './journal-entry-add.component.html',
})
export class JournalEntryAddComponent {
  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    mood: ['neutral', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    const entry = {
      ...this.form.value,
      mood: this.form.value.mood,
      date: new Date().toISOString().slice(0, 10),
    };

    this.journalService.addEntry(entry).subscribe({
      next: () => {
        alert('Entrée ajoutée avec succès !');
        this.form.reset({ mood: 'neutral' });
        this.router.navigate(['/journal']);
      },
      error: (err) => {
        console.error('Erreur ajout:', err);
        alert("Une erreur s'est produite.");
      }
    });
  }
}