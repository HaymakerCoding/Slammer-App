import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpScoresComponent } from './wrap-up-scores.component';

describe('WrapUpScoresComponent', () => {
  let component: WrapUpScoresComponent;
  let fixture: ComponentFixture<WrapUpScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
