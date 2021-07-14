import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDirectlyComponent } from './payment-directly.component';

describe('PaymentDirectlyComponent', () => {
  let component: PaymentDirectlyComponent;
  let fixture: ComponentFixture<PaymentDirectlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDirectlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
