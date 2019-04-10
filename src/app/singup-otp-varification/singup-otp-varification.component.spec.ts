import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingupOtpVarificationComponent } from './singup-otp-varification.component';

describe('SingupOtpVarificationComponent', () => {
  let component: SingupOtpVarificationComponent;
  let fixture: ComponentFixture<SingupOtpVarificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingupOtpVarificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingupOtpVarificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
