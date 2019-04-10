import { TestBed } from '@angular/core/testing';

import { ValidateAccountNumberService } from './validate-account-number.service';

describe('ValidateAccountNumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ValidateAccountNumberService = TestBed.get(ValidateAccountNumberService);
    expect(service).toBeTruthy();
  });
});
