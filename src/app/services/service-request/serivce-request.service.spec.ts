import { TestBed } from '@angular/core/testing';

import { SerivceRequestService } from './serivce-request.service';

describe('SerivceRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SerivceRequestService = TestBed.get(SerivceRequestService);
    expect(service).toBeTruthy();
  });
});
