import { TestBed } from '@angular/core/testing';

import { CustomValidationsService } from './custom-validations.service';

describe('CustomValidationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomValidationsService = TestBed.get(CustomValidationsService);
    expect(service).toBeTruthy();
  });
});
