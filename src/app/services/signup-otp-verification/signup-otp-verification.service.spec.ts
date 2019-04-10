import { TestBed } from '@angular/core/testing';

import { SignupOtpVerificationService } from './signup-otp-verification.service';

describe('SignupOtpVerificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignupOtpVerificationService = TestBed.get(SignupOtpVerificationService);
    expect(service).toBeTruthy();
  });
});
