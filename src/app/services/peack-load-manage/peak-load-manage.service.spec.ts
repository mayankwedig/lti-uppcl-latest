import { TestBed } from '@angular/core/testing';

import { PeakLoadManageService } from './peak-load-manage.service';

describe('PeakLoadManageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeakLoadManageService = TestBed.get(PeakLoadManageService);
    expect(service).toBeTruthy();
  });
});
