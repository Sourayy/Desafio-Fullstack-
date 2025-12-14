import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { SupplierModal } from '../../components/supplier-modal/supplier-modal';
import { ISupplier } from '../../../core/interface/supplier.interface';
import { SupplierService } from '../../../core/services/supplier/supplier';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier implements OnInit {
  displayedColumns: string[] = [
    'document',
    'name',
    'email',
    'birthDate',
    'cep',
    'uf',
    'city',
    'neighborhood',
    'street',
    'options',
  ];

  suppliers = signal<ISupplier[]>([]);
  nameFilter = new FormControl('');
  documentFilter = new FormControl('');

  private _dialog = inject(MatDialog);
  private _supplierService = inject(SupplierService);

  ngOnInit(): void {
    this.loadSuppliers();

    this.nameFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());

    this.documentFilter.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
  }

  applyFilters() {
    this._supplierService
      .getSuppliers({
        name: this.nameFilter.value ?? '',
        document: this.documentFilter.value ?? '',
      })
      .subscribe({
        next: (data) => this.suppliers.set(data),
        error: (err) => console.error(err),
      });
  }

  loadSuppliers() {
    this._supplierService.getSuppliers().subscribe({
      next: (data) => this.suppliers.set(data),
      error: (err) => console.error(err),
    });
  }

  openNewSupplierModal() {
    const dialogRef = this._dialog.open(SupplierModal, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((created: ISupplier) => {
      if (created) {
        this.suppliers.set([...this.suppliers(), created]);
      }
    });
  }

  editSupplier(supplier: ISupplier) {
    const dialogRef = this._dialog.open(SupplierModal, {
      width: '600px',
      disableClose: true,
      data: supplier,
    });

    dialogRef.afterClosed().subscribe((updated: ISupplier) => {
      if (updated) {
        this.suppliers.set(this.suppliers().map((s) => (s.id === updated.id ? updated : s)));
      }
    });
  }

  deleteSupplier(supplier: ISupplier) {
    const confirmDelete = confirm(`Do you really want to delete the supplier ${supplier.name}?`);

    if (!confirmDelete) return;

    this._supplierService.deleteSupplier(supplier.id!).subscribe({
      next: () => {
        this.suppliers.set(this.suppliers().filter((s) => s.id !== supplier.id));
      },
      error: (err) => console.error('Error deleting company:', err),
    });
  }
}
