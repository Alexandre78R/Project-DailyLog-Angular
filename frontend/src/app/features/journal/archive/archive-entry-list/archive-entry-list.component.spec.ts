import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveEntryListComponent } from './archive-entry-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ArchiveEntryListComponent', () => {
  let component: ArchiveEntryListComponent;
  let fixture: ComponentFixture<ArchiveEntryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveEntryListComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
