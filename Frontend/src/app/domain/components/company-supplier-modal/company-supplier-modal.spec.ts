import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySupplierModal } from './company-supplier-modal';

describe('CompanySupplierModal', () => {
  let component: CompanySupplierModal;
  let fixture: ComponentFixture<CompanySupplierModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySupplierModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySupplierModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
