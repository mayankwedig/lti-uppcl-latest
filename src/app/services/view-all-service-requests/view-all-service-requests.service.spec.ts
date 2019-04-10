import { TestBed } from '@angular/core/testing';

import { ViewAllServiceRequestsService } from './view-all-service-requests.service';

describe('ViewAllServiceRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewAllServiceRequestsService = TestBed.get(ViewAllServiceRequestsService);
    expect(service).toBeTruthy();
  });
});
