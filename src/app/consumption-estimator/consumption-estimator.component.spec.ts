import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionEstimatorComponent } from './consumption-estimator.component';

describe('ConsumptionEstimatorComponent', () => {
  let component: ConsumptionEstimatorComponent;
  let fixture: ComponentFixture<ConsumptionEstimatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionEstimatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionEstimatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
