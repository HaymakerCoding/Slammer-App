import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpStylinComponent } from './wrap-up-stylin.component';

describe('WrapUpStylinComponent', () => {
  let component: WrapUpStylinComponent;
  let fixture: ComponentFixture<WrapUpStylinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpStylinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpStylinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
