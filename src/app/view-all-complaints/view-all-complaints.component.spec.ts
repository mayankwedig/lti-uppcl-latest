import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllComplaintsComponent } from './view-all-complaints.component';

describe('ViewAllComplaintsComponent', () => {
  let component: ViewAllComplaintsComponent;
  let fixture: ComponentFixture<ViewAllComplaintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllComplaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
