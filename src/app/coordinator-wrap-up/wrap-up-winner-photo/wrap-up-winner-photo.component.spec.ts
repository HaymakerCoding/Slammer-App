import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapUpWinnerPhotoComponent } from './wrap-up-winner-photo.component';

describe('WrapUpWinnerPhotoComponent', () => {
  let component: WrapUpWinnerPhotoComponent;
  let fixture: ComponentFixture<WrapUpWinnerPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrapUpWinnerPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapUpWinnerPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
