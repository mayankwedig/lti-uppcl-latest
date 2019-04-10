import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesttrackComponent } from './requesttrack.component';

describe('RequesttrackComponent', () => {
  let component: RequesttrackComponent;
  let fixture: ComponentFixture<RequesttrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequesttrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesttrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
