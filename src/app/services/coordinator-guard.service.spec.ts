import { TestBed } from '@angular/core/testing';

import { CoordinatorGuardService } from './coordinator-guard.service';

describe('CoordinatorGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordinatorGuardService = TestBed.get(CoordinatorGuardService);
    expect(service).toBeTruthy();
  });
});
