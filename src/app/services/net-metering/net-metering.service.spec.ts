import { TestBed } from '@angular/core/testing';

import { NetMeteringService } from './net-metering.service';

describe('NetMeteringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetMeteringService = TestBed.get(NetMeteringService);
    expect(service).toBeTruthy();
  });
});
