import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KidMoneyTrackerComponent } from './kid-money-tracker.component';

describe('KidMoneyTrackerComponent', () => {
  let component: KidMoneyTrackerComponent;
  let fixture: ComponentFixture<KidMoneyTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KidMoneyTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KidMoneyTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
