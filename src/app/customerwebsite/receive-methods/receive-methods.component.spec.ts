import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveMethodsComponent } from './receive-methods.component';

describe('ReceiveMethodsComponent', () => {
  let component: ReceiveMethodsComponent;
  let fixture: ComponentFixture<ReceiveMethodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveMethodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
