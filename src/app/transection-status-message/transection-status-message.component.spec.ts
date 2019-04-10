import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransectionStatusMessageComponent } from './transection-status-message.component';

describe('TransectionStatusMessageComponent', () => {
  let component: TransectionStatusMessageComponent;
  let fixture: ComponentFixture<TransectionStatusMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransectionStatusMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransectionStatusMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
