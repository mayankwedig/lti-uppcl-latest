import { TestBed } from '@angular/core/testing';

import { NewConnectionRequest } from './new-connection-request.service';

describe('NewConnectionRequest', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewConnectionRequest = TestBed.get(NewConnectionRequest);
    expect(service).toBeTruthy();
  });
});
