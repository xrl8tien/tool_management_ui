import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentGuideComponent } from './payment-guide.component';

describe('PaymentGuideComponent', () => {
  let component: PaymentGuideComponent;
  let fixture: ComponentFixture<PaymentGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
