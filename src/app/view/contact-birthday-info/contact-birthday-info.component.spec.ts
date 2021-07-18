import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBirthdayInfoComponent } from './contact-birthday-info.component';

describe('ContactBirthdayInfoComponent', () => {
  let component: ContactBirthdayInfoComponent;
  let fixture: ComponentFixture<ContactBirthdayInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactBirthdayInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactBirthdayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
