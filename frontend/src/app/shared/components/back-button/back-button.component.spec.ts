import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButtonComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the default label if none is provided', () => {
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('a span:last-child')).nativeElement;
    expect(label.textContent).toContain('Retour');
  });

  it('should display the provided label', () => {
    component.label = 'Accueil';
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('a span:last-child')).nativeElement;
    expect(label.textContent).toContain('Accueil');
  });

  it('should set the correct routerLink', () => {
    component.routerLink = '/dashboard';
    fixture.detectChanges();
    const anchor = fixture.debugElement.query(By.css('a'));
    expect(anchor.attributes['ng-reflect-router-link']).toBe('/dashboard');
  });

  it('should include the emoji arrow', () => {
    fixture.detectChanges();
    const emoji = fixture.debugElement.query(By.css('a span:first-child')).nativeElement;
    expect(emoji.textContent).toContain('⬅️');
  });
});