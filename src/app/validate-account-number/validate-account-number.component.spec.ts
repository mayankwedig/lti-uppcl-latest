import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateAccountNumber } from './validate-account-number.component';

describe('ValidateAccountNumber', () => {
  let component: ValidateAccountNumber;
  let fixture: ComponentFixture<ValidateAccountNumber>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateAccountNumber ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAccountNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
