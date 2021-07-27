import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNoticeClaimComponent } from './form-notice-claim.component';

describe('FormNoticeClaimComponent', () => {
  let component: FormNoticeClaimComponent;
  let fixture: ComponentFixture<FormNoticeClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormNoticeClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNoticeClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
