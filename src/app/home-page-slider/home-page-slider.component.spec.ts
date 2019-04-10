import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageSliderComponent } from './home-page-slider.component';

describe('HomePageSliderComponent', () => {
  let component: HomePageSliderComponent;
  let fixture: ComponentFixture<HomePageSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
