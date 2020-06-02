import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpVolunteersComponent } from './wrap-up-volunteers.component';

describe('WrapUpVolunteersComponent', () => {
  let component: WrapUpVolunteersComponent;
  let fixture: ComponentFixture<WrapUpVolunteersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpVolunteersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpVolunteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
