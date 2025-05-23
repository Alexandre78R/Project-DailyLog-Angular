import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, HttpClientTestingModule],
      // declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        provideHttpClientTesting()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call auth.login if form is invalid', () => {
    component.form.setValue({ email: '', password: '' }); // form invalid
    component.submit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call auth.login and navigate on success', () => {
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    authServiceSpy.login.and.returnValue(of({})); // mock success response

    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password'
    });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should set serverError on login error', () => {
    component.form.setValue({ email: 'test@test.com', password: 'password' });
    const errorResponse = { error: { message: 'Une erreur inconnue est survenue.' } };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

    component.submit();

    expect(component.serverError).toBe('Une erreur inconnue est survenue.');
  });
});