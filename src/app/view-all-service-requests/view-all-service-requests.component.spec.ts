import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllServiceRequestsComponent } from './view-all-service-requests.component';

describe('ViewAllServiceRequestsComponent', () => {
  let component: ViewAllServiceRequestsComponent;
  let fixture: ComponentFixture<ViewAllServiceRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllServiceRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllServiceRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
