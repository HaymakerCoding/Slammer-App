import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventResultsTableComponent } from './event-results-table.component';

describe('EventResultsTableComponent', () => {
  let component: EventResultsTableComponent;
  let fixture: ComponentFixture<EventResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventResultsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
