import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleExecutiveSetKpiComponent } from './sale-executive-set-kpi.component';

describe('SaleExecutiveSetKpiComponent', () => {
  let component: SaleExecutiveSetKpiComponent;
  let fixture: ComponentFixture<SaleExecutiveSetKpiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleExecutiveSetKpiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleExecutiveSetKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
