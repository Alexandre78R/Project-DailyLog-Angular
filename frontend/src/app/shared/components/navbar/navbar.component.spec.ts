import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: any;
  let userSubject: Subject<any>;

  beforeEach(async () => {
    userSubject = new Subject();

    authServiceMock = {
      user$: userSubject.asObservable(),
      logout: jasmine.createSpy('logout'),
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isLoggedIn and username when user is emitted', () => {
    const mockUser = { name: 'Toto' };
    
    component.ngOnInit();
    userSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.isLoggedIn).toBeTrue();
    expect(component.username).toBe('Toto');
  });

  it('should update isLoggedIn and username to false/null when null user emitted', () => {
    userSubject.next(null);
    fixture.detectChanges();

    expect(component.isLoggedIn).toBeFalse();
    expect(component.username).toBeNull();
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});