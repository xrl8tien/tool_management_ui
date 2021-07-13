import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentByCashComponent } from './payment-by-cash.component';

describe('PaymentByCashComponent', () => {
  let component: PaymentByCashComponent;
  let fixture: ComponentFixture<PaymentByCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentByCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentByCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
