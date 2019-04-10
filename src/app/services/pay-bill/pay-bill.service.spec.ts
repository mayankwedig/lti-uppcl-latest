import { TestBed } from '@angular/core/testing';

import { PayBillService } from './pay-bill.service';

describe('PayBillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PayBillService = TestBed.get(PayBillService);
    expect(service).toBeTruthy();
  });
});
