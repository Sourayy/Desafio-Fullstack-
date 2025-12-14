import { TestBed } from '@angular/core/testing';

import { CompanySupplier } from './company-supplier';

describe('CompanySupplier', () => {
  let service: CompanySupplier;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanySupplier);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
