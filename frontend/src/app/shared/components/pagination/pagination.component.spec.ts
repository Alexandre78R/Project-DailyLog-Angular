import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate pages array correctly', () => {
    component.totalPages = 5;
    expect(component.pages).toEqual([1, 2, 3, 4, 5]);

    component.totalPages = 0;
    expect(component.pages).toEqual([]);

    component.totalPages = 1;
    expect(component.pages).toEqual([1]);
  });

  describe('changePage', () => {
    it('should emit pageChange event if page is valid and different from current', () => {
      component.totalPages = 5;
      component.currentPage = 2;

      spyOn(component.pageChange, 'emit');

      component.changePage(3);
      expect(component.pageChange.emit).toHaveBeenCalledWith(3);
    });

    it('should NOT emit pageChange if page is less than 1', () => {
      component.totalPages = 5;
      component.currentPage = 2;

      spyOn(component.pageChange, 'emit');

      component.changePage(0);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is greater than totalPages', () => {
      component.totalPages = 5;
      component.currentPage = 2;

      spyOn(component.pageChange, 'emit');

      component.changePage(6);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });

    it('should NOT emit pageChange if page is the same as currentPage', () => {
      component.totalPages = 5;
      component.currentPage = 2;

      spyOn(component.pageChange, 'emit');

      component.changePage(2);
      expect(component.pageChange.emit).not.toHaveBeenCalled();
    });
  });
});