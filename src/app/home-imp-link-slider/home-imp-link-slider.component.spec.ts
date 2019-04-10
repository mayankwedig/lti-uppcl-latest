import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeImpLinkSliderComponent } from './home-imp-link-slider.component';

describe('HomeImpLinkSliderComponent', () => {
  let component: HomeImpLinkSliderComponent;
  let fixture: ComponentFixture<HomeImpLinkSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeImpLinkSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeImpLinkSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
