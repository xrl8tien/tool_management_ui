import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleContactManageComponent } from './sale-contact-manage.component';

describe('SaleContactManageComponent', () => {
  let component: SaleContactManageComponent;
  let fixture: ComponentFixture<SaleContactManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleContactManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleContactManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
