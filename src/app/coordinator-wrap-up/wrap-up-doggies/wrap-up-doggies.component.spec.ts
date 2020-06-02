import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpDoggiesComponent } from './wrap-up-doggies.component';

describe('WrapUpDoggiesComponent', () => {
  let component: WrapUpDoggiesComponent;
  let fixture: ComponentFixture<WrapUpDoggiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpDoggiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpDoggiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
