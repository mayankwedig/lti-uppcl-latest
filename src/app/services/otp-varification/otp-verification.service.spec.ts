import { TestBed } from '@angular/core/testing';

import { OtpVerificationService } from './otp-verification.service';

describe('OtpVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OtpVerificationService = TestBed.get(OtpVerificationService);
    expect(service).toBeTruthy();
  });
});
