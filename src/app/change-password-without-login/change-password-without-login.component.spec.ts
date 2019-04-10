import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordWithoutLoginComponent } from './change-password-without-login.component';

describe('ChangePasswordWithoutLoginComponent', () => {
  let component: ChangePasswordWithoutLoginComponent;
  let fixture: ComponentFixture<ChangePasswordWithoutLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordWithoutLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordWithoutLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
