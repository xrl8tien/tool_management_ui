import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCustomerSendClaimRequestComponent } from './help-customer-send-claim-request.component';

describe('HelpCustomerSendClaimRequestComponent', () => {
  let component: HelpCustomerSendClaimRequestComponent;
  let fixture: ComponentFixture<HelpCustomerSendClaimRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCustomerSendClaimRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCustomerSendClaimRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
