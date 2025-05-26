import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalService } from '../services/journal.service';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';

@Component({
  selector: 'app-journal-entry-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackButtonComponent],
  templateUrl: './journal-entry-edit.component.html',
  styleUrl: './journal-entry-edit.component.css',
})
export class JournalEntryEditComponent implements OnInit {
  form!: FormGroup;
  entryId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private journalService: JournalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
      mood: ['', Validators.required]
    });

    this.entryId = Number(this.route.snapshot.paramMap.get('id'));
    this.journalService.getEntry(this.entryId).subscribe(entry => {
      this.form.patchValue(entry);
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.journalService.updateEntry(this.entryId, this.form.value).subscribe(() => {
        this.router.navigate(['/journal']);
      });
    }
  }
}