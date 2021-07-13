import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentByCreditCardComponent } from './payment-by-credit-card.component';

describe('PaymentByCreditCardComponent', () => {
  let component: PaymentByCreditCardComponent;
  let fixture: ComponentFixture<PaymentByCreditCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentByCreditCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentByCreditCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
