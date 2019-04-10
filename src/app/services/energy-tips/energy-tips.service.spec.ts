import { TestBed } from '@angular/core/testing';

import { EnergyTipsService } from './energy-tips.service';

describe('EnergyTipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnergyTipsService = TestBed.get(EnergyTipsService);
    expect(service).toBeTruthy();
  });
});
