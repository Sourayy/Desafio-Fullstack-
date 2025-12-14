import { TestBed } from '@angular/core/testing';

import { DocumentsValidator } from './documents-validator';

describe('DocumentsValidator', () => {
  let service: DocumentsValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentsValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
