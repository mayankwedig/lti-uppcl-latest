import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeakLoadManageComponent } from './peak-load-manage.component';

describe('PeakLoadManageComponent', () => {
  let component: PeakLoadManageComponent;
  let fixture: ComponentFixture<PeakLoadManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeakLoadManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeakLoadManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
