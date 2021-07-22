import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleEmployeeManageComponent } from './sale-employee-manage.component';

describe('SaleEmployeeManageComponent', () => {
  let component: SaleEmployeeManageComponent;
  let fixture: ComponentFixture<SaleEmployeeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleEmployeeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleEmployeeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
