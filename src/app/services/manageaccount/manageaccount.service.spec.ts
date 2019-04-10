import { TestBed } from '@angular/core/testing';

import { ManageaccountService } from './manageaccount.service';

describe('ManageaccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageaccountService = TestBed.get(ManageaccountService);
    expect(service).toBeTruthy();
  });
});
