import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyTipsComponent } from './energy-tips.component';

describe('EnergyTipsComponent', () => {
  let component: EnergyTipsComponent;
  let fixture: ComponentFixture<EnergyTipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyTipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
