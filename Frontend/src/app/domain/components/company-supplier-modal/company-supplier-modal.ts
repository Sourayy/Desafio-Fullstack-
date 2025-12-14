import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SupplierService } from '../../../core/services/supplier/supplier';
import { ISupplier } from '../../../core/interface/supplier.interface';
import { ICompany } from '../../../core/interface/company.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { CompanySupplierService } from '../../../core/services/company-supplier/company-supplier';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { differenceInYears, parse } from 'date-fns';

@Component({
  standalone: true,
  selector: 'app-company-supplier-modal',
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './company-supplier-modal.html',
  styleUrl: './company-supplier-modal.scss',
})
export class CompanySupplierModal implements OnInit {
  suppliers = signal<ISupplier[]>([]);
  linkedSupplierIds = signal<Set<number>>(new Set());
  filter = new FormControl('');
  displayedColumns: string[] = ['name', 'document', 'actions'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public company: ICompany,
    private supplierService: SupplierService,
    private companySupplierService: CompanySupplierService,
    private dialogRef: MatDialogRef<CompanySupplierModal>
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadLinkedSuppliers();

    this.filter.valueChanges.pipe(debounceTime(300)).subscribe(() => this.loadSuppliers());
  }

  loadLinkedSuppliers() {
    this.companySupplierService.getSuppliersByCompany(this.company.id!).subscribe((linked) => {
      const ids = new Set(linked.map((s) => s.id!));
      this.linkedSupplierIds.set(ids);
    });
  }

  loadSuppliers() {
    const searchTerm = this.filter.value?.trim() ?? '';

    const filterObj: any = {};
    if (searchTerm) {
      if (/^\d+$/.test(searchTerm)) {
        filterObj.document = searchTerm;
      } else {
        filterObj.name = searchTerm;
      }
    }

    this.supplierService.getSuppliers(filterObj).subscribe((data) => {
      const filtered = data.filter((s) => {
        if (this.company.uf !== 'PR') return true;

        if (!s.birthDate || s.document.length !== 11) return true;

        const birth = parse(s.birthDate, 'MM/dd/yyyy', new Date());
        const age = differenceInYears(new Date(), birth);

        return age >= 18;
      });

      this.suppliers.set(filtered);
    });
  }

  addSupplier(supplier: ISupplier) {
    this.companySupplierService.addSupplierToCompany(this.company.id!, supplier.id!).subscribe({
      next: () => {
        this.loadLinkedSuppliers();
        this.linkedSupplierIds.update((set) => {
          const newSet = new Set(set);
          newSet.add(supplier.id!);
          return newSet;
        });
      },
      error: (err) => alert(err.error),
    });
  }

  removeSupplier(supplier: ISupplier) {
    this.companySupplierService
      .removeSupplierFromCompany(this.company.id!, supplier.id!)
      .subscribe({
        next: () => {
          this.linkedSupplierIds.update((set) => {
            const newSet = new Set(set);
            newSet.delete(supplier.id!);
            return newSet;
          });
        },
        error: (err) => alert(err.error),
      });
  }
}
