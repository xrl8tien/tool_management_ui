import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleContactManageTableComponent } from './sale-contact-manage-table.component';

describe('SaleContactManageTableComponent', () => {
  let component: SaleContactManageTableComponent;
  let fixture: ComponentFixture<SaleContactManageTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleContactManageTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleContactManageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
