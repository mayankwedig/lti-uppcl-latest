import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclamiderComponent } from './disclamider.component';

describe('DisclamiderComponent', () => {
  let component: DisclamiderComponent;
  let fixture: ComponentFixture<DisclamiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclamiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclamiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
