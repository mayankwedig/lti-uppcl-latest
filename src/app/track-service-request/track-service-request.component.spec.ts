import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackServiceRequestComponent } from './track-service-request.component';

describe('TrackServiceRequestComponent', () => {
  let component: TrackServiceRequestComponent;
  let fixture: ComponentFixture<TrackServiceRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackServiceRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackServiceRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
