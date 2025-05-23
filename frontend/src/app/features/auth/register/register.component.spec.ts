import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']); // <-- Ici on espionne "navigate"

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call auth.register if form is invalid', () => {
    component.form.setValue({
      name: '',
      email: '',
      password: '',
    });
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call auth.register and navigate on success', () => {
    component.form.setValue({
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password'
    });
    authServiceSpy.register.and.returnValue(of({}));

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']); // <-- On vérifie "navigate"
  });

  it('should set serverError on registration error', () => {
    component.form.setValue({
      name: 'John Doe',
      email: 'test@test.com',
      password: 'password'
    });
    const errorResponse = { error: { message: 'User already exists' } };
    authServiceSpy.register.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();

    expect(component.serverError).toBe('User already exists');
  });
});