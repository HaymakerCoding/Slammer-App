import { TestBed } from '@angular/core/testing';

import { MostStylinService } from './most-stylin.service';

describe('MostStylinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MostStylinService = TestBed.get(MostStylinService);
    expect(service).toBeTruthy();
  });
});
