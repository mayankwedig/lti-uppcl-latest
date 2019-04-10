import { TestBed } from '@angular/core/testing';

import { ConsumptionEstimatorService } from './consumption-estimator.service';

describe('ConsumptionEstimatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumptionEstimatorService = TestBed.get(ConsumptionEstimatorService);
    expect(service).toBeTruthy();
  });
});
