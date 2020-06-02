import { TestBed } from '@angular/core/testing';

import { KidsMoneyService } from './kids-money.service';

describe('KidsMoneyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KidsMoneyService = TestBed.get(KidsMoneyService);
    expect(service).toBeTruthy();
  });
});
