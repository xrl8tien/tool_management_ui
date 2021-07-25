import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimManagerFormComponent } from './claim-manager-form.component';

describe('ClaimManagerFormComponent', () => {
  let component: ClaimManagerFormComponent;
  let fixture: ComponentFixture<ClaimManagerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimManagerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimManagerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
