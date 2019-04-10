import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetMeteringComponent } from './net-metering.component';

describe('NetMeteringComponent', () => {
  let component: NetMeteringComponent;
  let fixture: ComponentFixture<NetMeteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetMeteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetMeteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
