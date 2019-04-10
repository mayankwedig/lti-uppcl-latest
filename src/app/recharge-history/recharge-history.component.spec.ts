import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeHistoryComponent } from './recharge-history.component';

describe('RechargeHistoryComponent', () => {
  let component: RechargeHistoryComponent;
  let fixture: ComponentFixture<RechargeHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
