import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintRequestDetailsComponent } from './complaint-request-details.component';

describe('ComplaintRequestDetailsComponent', () => {
  let component: ComplaintRequestDetailsComponent;
  let fixture: ComponentFixture<ComplaintRequestDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintRequestDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
