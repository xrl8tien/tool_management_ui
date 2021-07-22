import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleDashboardComponent } from './sale-dashboard.component';

describe('SaleDashboardComponent', () => {
  let component: SaleDashboardComponent;
  let fixture: ComponentFixture<SaleDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
