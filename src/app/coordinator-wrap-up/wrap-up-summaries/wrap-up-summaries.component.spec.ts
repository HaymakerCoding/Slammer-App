import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpSummariesComponent } from './wrap-up-summaries.component';

describe('WrapUpSummariesComponent', () => {
  let component: WrapUpSummariesComponent;
  let fixture: ComponentFixture<WrapUpSummariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpSummariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpSummariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
