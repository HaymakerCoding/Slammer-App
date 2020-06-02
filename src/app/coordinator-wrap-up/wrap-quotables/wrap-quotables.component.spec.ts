import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapQuotablesComponent } from './wrap-quotables.component';

describe('WrapQuotablesComponent', () => {
  let component: WrapQuotablesComponent;
  let fixture: ComponentFixture<WrapQuotablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapQuotablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapQuotablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
