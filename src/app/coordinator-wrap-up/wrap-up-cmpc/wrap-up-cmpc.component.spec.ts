import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpCMPCComponent } from './wrap-up-cmpc.component';

describe('WrapUpCMPCComponent', () => {
  let component: WrapUpCMPCComponent;
  let fixture: ComponentFixture<WrapUpCMPCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpCMPCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpCMPCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
