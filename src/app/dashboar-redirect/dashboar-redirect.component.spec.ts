import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboarRedirectComponent } from './dashboar-redirect.component';

describe('DashboarRedirectComponent', () => {
  let component: DashboarRedirectComponent;
  let fixture: ComponentFixture<DashboarRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboarRedirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboarRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
