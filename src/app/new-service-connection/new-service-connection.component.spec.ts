import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServiceConnectionComponent } from './new-service-connection.component';

describe('NewServiceConnectionComponent', () => {
  let component: NewServiceConnectionComponent;
  let fixture: ComponentFixture<NewServiceConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewServiceConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewServiceConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
