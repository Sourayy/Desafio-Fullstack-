import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICompany } from '../../../core/interface/company.interface';
import { CompanyService } from '../../../core/services/company/company';
import { MatDialog } from '@angular/material/dialog';
import { CompanyModal } from '../../components/company-modal/company-modal';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CompanySupplierModal } from '../../components/company-supplier-modal/company-supplier-modal';

@Component({
  selector: 'app-company',
  imports: [MatTableModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './company.html',
  styleUrl: './company.scss',
})
export class Company implements OnInit {
  displayedColumns: string[] = [
    'cnpj',
    'fantasyName',
    'cep',
    'uf',
    'city',
    'neighborhood',
    'street',
    'options',
  ];

  companies = signal<ICompany[]>([]);
  nameFilter = new FormControl('');
  cnpjFilter = new FormControl('');

  private _companyService = inject(CompanyService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadCompanies();

    this.nameFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.cnpjFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    this._companyService
      .getCompanies({
        name: this.nameFilter.value ?? '',
        cnpj: this.cnpjFilter.value ?? '',
      })
      .subscribe({
        next: (data) => this.companies.set(data),
        error: (err) => console.error(err),
      });
  }

  manageSuppliers(company: ICompany) {
    this.dialog.open(CompanySupplierModal, {
      width: '700px',
      data: company,
    });
  }

  openNewCompanyModal() {
    const dialogRef = this.dialog.open(CompanyModal, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((created: ICompany) => {
      if (created) {
        this.companies.set([...this.companies(), created]);
      }
    });
  }

  loadCompanies() {
    this._companyService.getCompanies().subscribe({
      next: (data) => this.companies.set(data),
      error: (err) => console.error(err),
    });
  }

  editCompany(company: ICompany) {
    const dialogRef = this.dialog.open(CompanyModal, {
      width: '600px',
      disableClose: true,
      data: company,
    });

    dialogRef.afterClosed().subscribe((updated: ICompany) => {
      if (updated) {
        this.companies.set(this.companies().map((c) => (c.id === updated.id ? updated : c)));
      }
    });
  }

  deleteCompany(company: ICompany) {
    const confirmDelete = confirm(`Do you really want to delete the company ${company.fantasyName}?`);

    if (!confirmDelete) return;

    this._companyService.deleteCompany(company.id!).subscribe({
      next: () => {
        this.companies.set(this.companies().filter((s) => s.id !== company.id));
      },
      error: (err) => {
        console.error('Error deleting company:', err);
      },
    });
  }
}
