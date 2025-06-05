import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { By } from '@angular/platform-browser';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirm event when Confirm button is clicked', () => {
    spyOn(component.confirm, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('button'));

    const confirmButton = buttons[buttons.length - 1];

    confirmButton.nativeElement.click();
    expect(component.confirm.emit).toHaveBeenCalled();
  });

  it('should emit cancel event when Cancel button is clicked', () => {
    spyOn(component.cancel, 'emit');

    const cancelButton = fixture.debugElement.query(
      By.css('.flex > button:first-child')
    );
    expect(cancelButton).toBeTruthy();

    cancelButton.nativeElement.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });

  it('should emit cancel event when close (X) button is clicked', () => {
    spyOn(component.cancel, 'emit');

    const closeButton = fixture.debugElement.query(
      By.css('button[aria-label="Fermer"]')
    );
    expect(closeButton).toBeTruthy();

    closeButton.nativeElement.click();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});