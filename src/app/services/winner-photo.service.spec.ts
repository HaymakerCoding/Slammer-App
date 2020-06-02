import { TestBed } from '@angular/core/testing';

import { WinnerPhotoService } from './winner-photo.service';

describe('WinnerPhotoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WinnerPhotoService = TestBed.get(WinnerPhotoService);
    expect(service).toBeTruthy();
  });
});
