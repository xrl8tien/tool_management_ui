import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPaymentComponent } from './notification-payment.component';

describe('NotificationPaymentComponent', () => {
  let component: NotificationPaymentComponent;
  let fixture: ComponentFixture<NotificationPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
