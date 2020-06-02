import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpKidsMoneyComponent } from './wrap-up-kids-money.component';

describe('WrapUpKidsMoneyComponent', () => {
  let component: WrapUpKidsMoneyComponent;
  let fixture: ComponentFixture<WrapUpKidsMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpKidsMoneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpKidsMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
