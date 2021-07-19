import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayNotificationDialogComponent } from './day-notification-dialog.component';

describe('DayNotificationDialogComponent', () => {
  let component: DayNotificationDialogComponent;
  let fixture: ComponentFixture<DayNotificationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayNotificationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
